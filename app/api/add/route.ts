import { PrismaClient } from "@prisma/client"
import { NextRequest } from "next/server"

const prisma = new PrismaClient();

interface BookData {
    title: string;
    part_of_series: boolean;
    series?: string;
    part_in_series?: number;
    total_parts_in_series?: number;
    themes: string[];
    authors: string[];
    chapter_length: number;
    difficulty: number;
    age_lower: number;
    age_upper: number;
    comment?: string;
    illustrations: string;
    awards: string[];
    teachers_guide?: string;
    filmatized: boolean;
    first_paragraph: string;
    abstract_school_words: string[];
}

interface RequestBody {
    book_data: BookData;
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
