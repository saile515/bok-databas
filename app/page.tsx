import BookBrowser from "./BookBrowser";

export default function Home(props: { searchParams: { page: string } }) {
    return (
        <div>
            <BookBrowser page={parseInt(props.searchParams.page) || 1} />
        </div>
    );
}
