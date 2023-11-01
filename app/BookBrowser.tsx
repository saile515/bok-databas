import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import type { Book } from "@prisma/client";

export const entries_per_page = 20;
const prisma = new PrismaClient();

async function PageSelector(props: { page: number }) {
    const total_pages = 9; // (await prisma.book.count()) / entries_per_page;

    return (
        <div className="flex gap-2 m-2 float-right">
            <Link href="./?page=1" className={`page-button ${props.page < 3 ? "invisible pointer-events-none" : ""}`}>
                1
            </Link>
            <span className={`${props.page < 3 ? "invisible pointer-events-none" : ""}`}>...</span>
            <Link
                href={`./?page=${props.page - 1}`}
                className={`page-button ${props.page < 2 ? "invisible pointer-events-none" : ""}`}
            >
                {props.page - 1}
            </Link>{" "}
            <Link href="./?page=1" className="page-button bg-blue-500">
                {props.page}
            </Link>{" "}
            <Link
                href={`./?page=${props.page + 1}`}
                className={`page-button ${total_pages - props.page < 1 ? "invisible pointer-events-none" : ""}`}
            >
                {props.page + 1}
            </Link>{" "}
            <span className={`${total_pages - props.page < 2 ? "invisible pointer-events-none" : ""}`}>...</span>
            <Link
                href={`./?page=${total_pages}`}
                className={`page-button ${total_pages - props.page < 2 ? "invisible pointer-events-none" : ""}`}
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

export default async function BookBrowser(props: { page: number }) {
    const books = await prisma.book.findMany({
        skip: props.page * entries_per_page - entries_per_page,
        take: entries_per_page,
    });

    return (
        <div className="bg-zinc-100 dark:bg-zinc-800 py-4 rounded border border-zinc-300 dark:border-zinc-700 max-w-6xl overflow-auto">
            <PageSelector page={props.page} />
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
                    {books.map((book_data) => (
                        <BookListItem key={book_data.id} data={book_data} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
