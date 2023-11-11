import prisma from "./prisma";
import type { Book } from "@prisma/client";

const revalidate = 1000 * 60 * 60 * 24;

function cache<T>(fn: () => Promise<T>) {
    let last_query = performance.now();
    let cached_data: T;

    return async function get_data() {
        if (performance.now() - last_query < revalidate && cached_data) {
            return cached_data;
        } else {
            cached_data = await fn();
            last_query = performance.now();
            return cached_data;
        }
    };
}

export const get_books = cache<Book[]>(async () => {
    return prisma.book.findMany();
});

export const count_books = cache<number>(async () => {
    return prisma.book.count();
});
