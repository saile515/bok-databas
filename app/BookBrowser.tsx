import { PrismaClient } from "@prisma/client";
import type { Book } from "@prisma/client";

const entries_per_page = 20;

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
    const prisma = new PrismaClient();

    const books = await prisma.book.findMany({
        skip: props.page * entries_per_page - entries_per_page,
        take: entries_per_page,
    });

    return (
        <div className="bg-zinc-100 dark:bg-zinc-800 py-4 rounded border border-zinc-300 dark:border-zinc-700">
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
