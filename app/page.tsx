import BookBrowser from "./BookBrowser";

export interface SearchParams {
    page: number;
    query?: string;
}

export default function Home(props: { searchParams: any }) {
    const search_params: SearchParams = { ...props.searchParams, page: parseInt(props.searchParams.page) || 1 };

    return (
        <div className="flex justify-center">
            <BookBrowser search_params={search_params} />
        </div>
    );
}
