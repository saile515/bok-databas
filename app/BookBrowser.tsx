import Link from "next/link";
import prisma from "./prisma";
import type { Book } from "@prisma/client";
import { SearchParams } from "./page";
import SearchBox from "./SeachBox";
import Fuse from "fuse.js";

const entries_per_page = 20;

export function construct_search_params(search_params: SearchParams) {
    return `./?page=${search_params.page}${search_params.query ? `&query=${search_params.query}` : ""}`;
}

async function PageSelector(props: { search_params: SearchParams }) {
    const total_pages = Math.ceil((await prisma.book.count()) / entries_per_page);

    return (
        <div className="flex gap-2 ml-auto">
            <Link
                href={construct_search_params({ ...props.search_params, page: 1 })}
                className={`page-button ${props.search_params.page < 3 ? "invisible pointer-events-none" : ""}`}
            >
                1
            </Link>
            <span className={`${props.search_params.page < 3 ? "invisible pointer-events-none" : ""}`}>...</span>
            <Link
                href={construct_search_params({ ...props.search_params, page: props.search_params.page - 1 })}
                className={`page-button ${props.search_params.page < 2 ? "invisible pointer-events-none" : ""}`}
            >
                {props.search_params.page - 1}
            </Link>
            <p className="page-button bg-blue-500">{props.search_params.page}</p>
            <Link
                href={construct_search_params({ ...props.search_params, page: props.search_params.page + 1 })}
                className={`page-button ${
                    total_pages - props.search_params.page < 1 ? "invisible pointer-events-none" : ""
                }`}
            >
                {props.search_params.page + 1}
            </Link>
            <span className={`${total_pages - props.search_params.page < 2 ? "invisible pointer-events-none" : ""}`}>
                ...
            </span>
            <Link
                href={construct_search_params({ ...props.search_params, page: total_pages })}
                className={`page-button ${
                    total_pages - props.search_params.page < 2 ? "invisible pointer-events-none" : ""
                }`}
            >
                {total_pages}
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
        <div className="bg-zinc-100 dark:bg-zinc-800 pb-2 rounded border border-zinc-300 dark:border-zinc-700 w-full max-w-6xl overflow-auto">
            <div className="p-4 flex items-center">
                <SearchBox search_params={props.search_params} />
                <PageSelector search_params={props.search_params} />
            </div>
            <table className="text-left w-full">
                <thead>
                    <tr className="bg-zinc-200 dark:bg-zinc-700">
                        <th className="table-cell table-head">Titel</th>
                        <th className="table-cell table-head">Författare</th>
                        <th className="table-cell table-head">Svårighetsgrad</th>
                        <th className="table-cell table-head">Ålder</th>
                        <th className="table-cell table-head">Teman</th>
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
    );
}
