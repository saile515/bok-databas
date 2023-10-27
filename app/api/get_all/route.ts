import { PrismaClient } from "@prisma/client"
import { NextRequest } from "next/server"

const entires_per_page = 20;

const prisma = new PrismaClient();

interface RequestBody {
    page: number
}

export default async function handle(req: NextRequest) {
    const { page }: RequestBody = await req.json();
    const books = await prisma.book.findMany({ skip: page * entires_per_page, take: entires_per_page });

    return new Response(books);
}
