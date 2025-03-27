"use client";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useBookStore } from "@/store/bookStore";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

interface Book {
  index: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
}

interface Review {
  reviewer: string;
  comment: string;
  rating: number;
}

interface BookDetails extends Book {
  description: string;
  publishedDate: string;
  pageCount: number;
  coverImage: string;
  rating: number;
  reviews: Review[];
  language: "English" | "Spanish" | "Italian";
}

export default function BookList() {
  const { seed, region, likes, reviews } = useBookStore();
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [bookDetails, setBookDetails] = useState<{ [isbn: string]: BookDetails }>({});

  const fetchBooks = async (pageNumber: number) => {
    try {
      const query = new URLSearchParams();
      query.append("seed", seed.toString());
      query.append("region", region.toLowerCase()); // Ensure lowercase
      query.append("likes", likes.toString());
      query.append("reviews", reviews.toString());
      query.append("page", pageNumber.toString());

      console.log("Fetching books with query:", query.toString()); // Debugging

      const res = await fetch(`/api/books?${query.toString()}`);
      const newBooks: Book[] = await res.json();

      console.log("Books fetched:", newBooks); // Debugging

      setBooks((prevBooks) => [...prevBooks, ...newBooks]);
      setHasMore(newBooks.length > 0);
      setPage(pageNumber + 1);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    setBooks([]); // ✅ Clear previous books
    setBookDetails({}); // ✅ Clear previous details
    setPage(1);
    setHasMore(true);
    fetchBooks(1);
  }, [seed, region, likes, reviews]); // ✅ Re-fetch when filters change

  const fetchBookDetails = async (isbn: string) => {
    const query = new URLSearchParams();
    query.append("region", region.toLowerCase()); // Ensure lowercase
    query.append("isbn", isbn); // Ensure lowercase
    try {
      const res = await fetch(`/api/books?${query.toString()}`); // Adjusted to use the correct API endpoint
      // const res = await fetch(`/api/books?isbn=${isbn}&region=${selectedLanguage}`);
      if (!res.ok) throw new Error("Failed to fetch book details");

      const details = await res.json();
      console.log("Details fetched..", details);
      setBookDetails((prevDetails) => ({
        ...prevDetails,
        [isbn]: details,
      }));
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  const toggleBookDetails = (isbn: string) => {
    if (expandedBook === isbn) {
      setExpandedBook(null);
    } else {
      setExpandedBook(isbn);
      if (!bookDetails[isbn]) {
        fetchBookDetails(isbn);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div id="scrollableDiv" className="flex-1 overflow-y-auto max-h-[1000px]">
        <InfiniteScroll
          dataLength={books.length}
          next={() => fetchBooks(page)}
          hasMore={hasMore}
          loader={
            <div className="p-4 text-center">
              <p>Loading more books...</p>
            </div>
          }
          scrollableTarget="scrollableDiv"
          style={{ overflow: "visible" }}
        >
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 sticky top-0">
                <th className="p-2">Index</th>
                <th className="p-2">ISBN</th>
                <th className="p-2">Title</th>
                <th className="p-2">Author</th>
                <th className="p-2">Publisher</th>
                <th className="p-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <React.Fragment key={book.isbn}>
                  <tr className="border border-gray-300 hover:bg-gray-50">
                    <td className="p-2">{book.index}</td>
                    <td className="p-2">{book.isbn}</td>
                    <td className="p-2">{book.title}</td>
                    <td className="p-2">{book.author}</td>
                    <td className="p-2">{book.publisher}</td>
                    <td className="p-2 text-center">
                      <button onClick={() => toggleBookDetails(book.isbn)} className="p-2">
                        {expandedBook === book.isbn ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Row for Details */}
                  {expandedBook === book.isbn && bookDetails[book.isbn] && (
                    <tr className="bg-gray-100">
                      <td colSpan={6} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Left: Cover Image */}
                          <div className="flex justify-center">
                            <img src={bookDetails[book.isbn].coverImage} alt={bookDetails[book.isbn].title} className="w-40 h-60 object-cover rounded-md shadow-md" />
                          </div>

                          {/* Right: Details */}
                          <div className="text-sm text-gray-700">
                            <p>
                              <strong>Description:</strong> {bookDetails[book.isbn].description}
                            </p>
                            <p>
                              <strong>Published:</strong> {bookDetails[book.isbn].publishedDate}
                            </p>
                            <p>
                              <strong>Pages:</strong> {bookDetails[book.isbn].pageCount}
                            </p>
                            <p>
                              <strong>Language:</strong> {bookDetails[book.isbn]?.language || "Unknown"}
                            </p>
                            <p>
                              <strong>Rating:</strong> ⭐ {bookDetails[book.isbn].rating} / 5
                            </p>

                            {/* Reviews Section */}
                            <div className="mt-3">
                              <strong>Reviews:</strong>
                              {bookDetails[book.isbn].reviews.length > 0 ? (
                                <ul className="mt-1 space-y-2">
                                  {bookDetails[book.isbn].reviews.map((review, i) => (
                                    <li key={i} className="p-2 bg-gray-50 border rounded-md shadow-sm">
                                      <p className="font-semibold">{review.reviewer}</p>
                                      <p className="text-gray-600">{review.comment}</p>
                                      <p className="text-yellow-500">⭐ {review.rating} / 5</p>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-500">No reviews available.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
}
