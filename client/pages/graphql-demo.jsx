import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import { getAllBooks } from "../services/graphqlApi";

export default function GraphQLDemoPage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getAllBooks();

      setBooks(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">
          GraphQL Demo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="border rounded-xl p-4 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {book.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {book.author}
              </p>

              <p className="text-sm text-gray-500">
                {book.category}
              </p>

              <p className="text-sm text-gray-500">
                {book.year}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}