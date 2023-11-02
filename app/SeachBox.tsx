"use client";

import { useState, useRef } from "react";
import { SearchParams } from "./page";
import { useRouter } from "next/navigation";
import { construct_search_params } from "./BookBrowser";
import Link from "next/link";

export default function SearchBox(props: { search_params: SearchParams }) {
    const [query, set_query] = useState<string>("");
    const router = useRouter();
    const ref = useRef(null);

    return (
        <div>
            <input
                type="text"
                value={query}
                ref={ref}
                onChange={(event) => set_query(event.target.value)}
                className="input-field rounded-full"
                onKeyDown={(event) => {
                    if (document.activeElement == ref.current && event.code == "Enter") {
                        router.push(construct_search_params({ ...props.search_params, query: query }));
                        set_query("");
                    }
                }}
            />
            {props.search_params.query && (
                <span className="text-zinc-700 dark:text-zinc-300 ml-4">
                    Söker efter: <span className="font-bold">{props.search_params.query}</span>
                    <Link
                        href={construct_search_params({ ...props.search_params, query: undefined })}
                        className="ml-2 italic underline text-zinc-500"
                    >
                        Rensa
                    </Link>
                </span>
            )}
        </div>
    );
}
