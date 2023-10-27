import { PrismaClient } from "@prisma/client"
import { NextRequest } from "next/server"

const prisma = new PrismaClient();

export default async function handle(req: NextRequest) {
    const book_total = await prisma.book.count();

    return new Response(book_total);
}
