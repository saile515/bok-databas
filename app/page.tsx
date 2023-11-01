import BookBrowser from "./BookBrowser";

export default function Home(props: { searchParams: { page: string } }) {
    return (
        <div className="flex justify-center">
            <BookBrowser page={parseInt(props.searchParams.page) || 1} />
        </div>
    );
}
