import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const book_total = await prisma.book.count();

    return Response.json(book_total);
}
