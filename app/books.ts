import { cache } from "react";
import prisma from "./prisma";

export const revalidate = 60 * 60 * 24;

export const get_books = cache(async () => {
    return await prisma.book.findMany();
});

export const count_books = cache(async () => {
    return await prisma.book.count();
});
