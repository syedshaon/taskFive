"use client";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useBookStore } from "@/store/bookStore";

interface Book {
  index: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
}
export default function BookList() {
  const { seed, region, likes, reviews } = useBookStore();
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchBooks = async (pageNumber: number) => {
    try {
      const res = await fetch(`/api/books?seed=${seed}&region=${region}&likes=${likes}&reviews=${reviews}&page=${pageNumber}`);
      const newBooks: Book[] = await res.json();

      setBooks((prevBooks) => [...prevBooks, ...newBooks]);
      setHasMore(newBooks.length > 0);
      setPage(pageNumber + 1);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setHasMore(false);
    } finally {
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    setBooks([]);
    setPage(1);
    setHasMore(true);
    setInitialLoad(true);
    fetchBooks(1);
  }, [seed, region, likes, reviews]);

  return (
    <div id="scrollableDiv" className="flex-1 overflow-y-auto max-h-[800px]">
      <InfiniteScroll dataLength={books.length} next={() => fetchBooks(page)} hasMore={hasMore} loader={<div className="p-4 text-center">{!initialLoad && <p>Loading more books...</p>}</div>} scrollableTarget="scrollableDiv" style={{ overflow: "visible" }}>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 sticky top-0">
              <th className="p-2">Index</th>
              <th className="p-2">ISBN</th>
              <th className="p-2">Title</th>
              <th className="p-2">Author</th>
              <th className="p-2">Publisher</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.isbn} className="border border-gray-300 hover:bg-gray-50">
                <td className="p-2">{book.index}</td>
                <td className="p-2">{book.isbn}</td>
                <td className="p-2">{book.title}</td>
                <td className="p-2">{book.author}</td>
                <td className="p-2">{book.publisher}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
}
