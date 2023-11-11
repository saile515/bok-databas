import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { Book } from "@prisma/client";

const prisma = new PrismaClient();

interface RequestBody {
    book_data: Book;
    admin_key: string;
}

export async function POST(req: NextRequest) {
    const { book_data, admin_key }: RequestBody = await req.json();

    if (admin_key != process.env.ADMIN_KEY) {
        return new Response(null, { status: 401 });
    }

    const book = await prisma.book.create({ data: book_data });

    if (book) {
        return new Response(null, { status: 200 });
    } else {
        return new Response(null, { status: 500 });
    }
}
