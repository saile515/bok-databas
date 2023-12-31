import Link from "next/link";
import type { Book } from "@prisma/client";
import { SearchParams, SortItem } from "./page";
import SearchBox from "./SeachBox";
import Fuse from "fuse.js";
import { get_books, count_books } from "./books";

const entries_per_page = 20;

export function construct_search_params(search_params: SearchParams) {
    let search_params_string = "./?";

    for (let parameter in search_params) {
        parameter = parameter as keyof typeof search_params;

        search_params_string += `${
            search_params[parameter as keyof typeof search_params]
                ? `${search_params_string.length == 3 ? "" : "&"}${parameter}=${
                      search_params[parameter as keyof typeof search_params]
                  }`
                : ""
        }`;
    }

    return search_params_string;
}

async function PageSelector(props: { search_params: SearchParams }) {
    const total_pages = Math.ceil((await count_books()) / entries_per_page);

    return (
        <div className="flex gap-2 mt-4 sm:mt-0 ml-auto items-center">
            <Link
                scroll={false}
                href={construct_search_params({ ...props.search_params, page: 1 })}
                className={`page-button ${props.search_params.page < 2 ? "page-button-disabled" : ""}`}>
                &lt;&lt;
            </Link>
            <Link
                scroll={false}
                href={construct_search_params({ ...props.search_params, page: props.search_params.page - 1 })}
                className={`page-button ${props.search_params.page < 2 ? "page-button-disabled" : ""}`}>
                &lt;
            </Link>
            <p className="w-6 text-center">{props.search_params.page}</p>
            <Link
                scroll={false}
                href={construct_search_params({ ...props.search_params, page: props.search_params.page + 1 })}
                className={`page-button ${total_pages - props.search_params.page < 1 ? "page-button-disabled" : ""}`}>
                &gt;
            </Link>
            <Link
                scroll={false}
                href={construct_search_params({ ...props.search_params, page: total_pages })}
                className={`page-button ${total_pages - props.search_params.page < 2 ? "page-button-disabled" : ""}`}>
                &gt;&gt;
            </Link>
        </div>
    );
}

function BookListItem(props: { data: Book }) {
    return (
        <tr className="border-t border-zinc-700">
            <td className="table-cell">{props.data.title}</td>
            <td className="table-cell">{props.data.authors.join(", ")}</td>
            <td className="table-cell">{props.data.difficulty}</td>
            <td className="table-cell">{props.data.chapter_length}</td>
            <td className="table-cell">
                {props.data.age_lower}-{props.data.age_upper}
            </td>
            <td className="table-cell">{props.data.tags.join(", ")}</td>
        </tr>
    );
}

function TableHead(props: { id: SortItem; label: string; search_params: SearchParams }) {
    return (
        <th className="table-cell uppercase text-zinc-600 dark:text-zinc-400 text-sm min-w-sm">
            <Link
                scroll={false}
                href={construct_search_params({
                    ...props.search_params,
                    // Disable sort if sort order is ascending
                    sort_item:
                        props.search_params.sort_item == props.id && props.search_params.sort_order == "ascending"
                            ? undefined
                            : props.id,
                    // Determine sort order based on sort item and current sort order
                    sort_order:
                        props.search_params.sort_item == props.id
                            ? props.search_params.sort_order == "descending"
                                ? "ascending"
                                : undefined
                            : "descending",
                })}
                className="w-full h-full block">
                {props.label}
                <span className="text-lg text-center leading-3 w-6 h-3 inline-block">
                    {/* Select arrow based on sort order */}
                    {props.search_params.sort_order && props.search_params.sort_item == props.id
                        ? props.search_params.sort_order == "descending"
                            ? " ↓"
                            : " ↑"
                        : ""}
                </span>
            </Link>
        </th>
    );
}

export default async function BookBrowser(props: { search_params: SearchParams }) {
    const books = await get_books();
    const fuse_options = {
        includeScore: true,
        keys: ["title", "authors", "tags"],
    };

    const fuse = new Fuse(books, fuse_options);

    // Books that match search
    let relevant_books = props.search_params.query
        ? fuse.search(props.search_params.query)
        : books.map((book) => ({ item: book }));

    // Sort books based on query
    const sort_order_multiplier = props.search_params.sort_order == "descending" ? 1 : -1;
    const sort_item = props.search_params.sort_item;
    switch (sort_item) {
        case "title":
            relevant_books.sort((a, b) => {
                return a.item.title.toLowerCase() < b.item.title.toLowerCase()
                    ? -1 * sort_order_multiplier
                    : 1 * sort_order_multiplier;
            });
            break;
        case "authors":
        case "tags":
            relevant_books.sort((a, b) => {
                return a.item[sort_item][0].toLowerCase() < b.item[sort_item][0].toLowerCase()
                    ? -1 * sort_order_multiplier
                    : 1 * sort_order_multiplier;
            });
            break;
        case "difficulty":
        case "chapter_length":
            relevant_books.sort((a, b) => {
                return (a.item[sort_item] - b.item[sort_item]) * sort_order_multiplier;
            });
            break;
        case "age":
            relevant_books.sort((a, b) => {
                const compare_property = props.search_params.sort_order == "descending" ? "age_lower" : "age_upper";
                return (a.item[compare_property] - b.item[compare_property]) * sort_order_multiplier;
            });
            break;
    }

    // Pagination
    const start_index = props.search_params.page * entries_per_page - entries_per_page;
    relevant_books = relevant_books.slice(start_index, start_index + entries_per_page + 1);

    return (
        <div className="bg-zinc-100 dark:bg-zinc-800 pb-2 rounded border border-zinc-300 dark:border-zinc-700 w-full max-w-6xl">
            <div className="p-4 flex flex-col sm:flex-row">
                <SearchBox search_params={props.search_params} />
                <PageSelector search_params={props.search_params} />
            </div>
            <div className="overflow-auto">
                <table className="text-left w-full">
                    <thead>
                        <tr className="bg-zinc-200 dark:bg-zinc-700">
                            <TableHead id="title" label="Titel" search_params={props.search_params} />
                            <TableHead id="authors" label="Författare" search_params={props.search_params} />
                            <TableHead id="difficulty" label="LIX-tal" search_params={props.search_params} />
                            <TableHead id="chapter_length" label="Kapitellängd" search_params={props.search_params} />
                            <TableHead id="age" label="Ålder" search_params={props.search_params} />
                            <TableHead id="tags" label="Taggar" search_params={props.search_params} />
                        </tr>
                    </thead>
                    <tbody>
                        {relevant_books
                            .map((book) => book.item)
                            .map((book_data) => (
                                <BookListItem key={book_data.id} data={book_data} />
                            ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 flex">
                <PageSelector search_params={props.search_params} />
            </div>
        </div>
    );
}
