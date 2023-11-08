import BookBrowser from "./BookBrowser";

export interface SearchParams {
    page: number;
    query?: string;
    sort_item?: "title" | "authors" | "difficulty" | "age" | "themes";
    sort_order?: "ascending" | "descending";
}

export default function Home(props: { searchParams: any }) {
    const search_params: SearchParams = { ...props.searchParams, page: parseInt(props.searchParams.page) || 1 };

    return (
        <div className="flex items-center flex-col p-4">
            <div className="max-w-6xl my-16 leading-8 text-lg">
                <h1 className="text-3xl">Böcker att läsa ordnade efter svårighetsgrad</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>
            <BookBrowser search_params={search_params} />
        </div>
    );
}
