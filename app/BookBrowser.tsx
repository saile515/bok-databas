import Link from "next/link";
import prisma from "./prisma";
import type { Book } from "@prisma/client";
import { SearchParams } from "./page";
import SearchBox from "./SeachBox";
import Fuse from "fuse.js";

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
    const total_pages = Math.ceil((await prisma.book.count()) / entries_per_page);

    return (
        <div className="flex gap-2 mt-4 sm:mt-0 ml-auto items-center">
            <Link
                href={construct_search_params({ ...props.search_params, page: 1 })}
                className={`page-button ${props.search_params.page < 2 ? "page-button-disabled" : ""}`}
            >
                &lt;&lt;
            </Link>
            <Link
                href={construct_search_params({ ...props.search_params, page: props.search_params.page - 1 })}
                className={`page-button ${props.search_params.page < 2 ? "page-button-disabled" : ""}`}
            >
                &lt;
            </Link>
            <p className="w-6 text-center">{props.search_params.page}</p>
            <Link
                href={construct_search_params({ ...props.search_params, page: props.search_params.page + 1 })}
                className={`page-button ${total_pages - props.search_params.page < 1 ? "page-button-disabled" : ""}`}
            >
                &gt;
            </Link>
            <Link
                href={construct_search_params({ ...props.search_params, page: total_pages })}
                className={`page-button ${total_pages - props.search_params.page < 2 ? "page-button-disabled" : ""}`}
            >
                &gt;&gt;
            </Link>
        </div>
    );
}

function BookListItem(props: { data: Book }) {
    return (
        <tr className="border-t border-zinc-700">
            <td className="table-cell">{props.data.title}</td>
            <td className="table-cell">{props.data.authors.toString()}</td>
            <td className="table-cell">{props.data.difficulty}</td>
            <td className="table-cell">
                {props.data.age_lower}-{props.data.age_upper}
            </td>
            <td className="table-cell">{props.data.themes.toString()}</td>
        </tr>
    );
}

function TableHead(props: {
    id: "title" | "authors" | "difficulty" | "age" | "themes";
    label: string;
    search_params: SearchParams;
}) {
    return (
        <th className="table-cell uppercase text-zinc-600 dark:text-zinc-400 text-sm min-w-sm">
            <Link
                href={construct_search_params({
                    ...props.search_params,
                    sort_item:
                        props.search_params.sort_item == props.id && props.search_params.sort_order == "ascending"
                            ? undefined
                            : props.id,
                    sort_order:
                        props.search_params.sort_item == props.id
                            ? props.search_params.sort_order == "descending"
                                ? "ascending"
                                : undefined
                            : "descending",
                })}
                className="w-full h-full block"
            >
                {props.label}
                <span className="text-2xl text-center leading-4 w-6 h-4 inline-block">
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
    const books = await prisma.book.findMany();

    const fuse_options = {
        includeScore: true,
        keys: ["title", "authors"],
    };

    const fuse = new Fuse(books, fuse_options);

    let relevant_books = props.search_params.query
        ? fuse.search(props.search_params.query)
        : books.map((book) => ({ item: book }));

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
                            <TableHead id="difficulty" label="Svårighetsgrad" search_params={props.search_params} />
                            <TableHead id="age" label="Ålder" search_params={props.search_params} />
                            <TableHead id="themes" label="Teman" search_params={props.search_params} />
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
        </div>
    );
}
