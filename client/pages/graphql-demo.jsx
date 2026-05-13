import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL = "https://library-backend-production-244f.up.railway.app/api/books";

export default function GraphQLDemoPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      };

      const res = await fetch(API_URL, { method: "GET", headers });
      const basicData = await res.json();

      if (res.ok && Array.isArray(basicData)) {
        const detailPromises = basicData.map((book) =>
          fetch(`${API_URL}/${book.id}`, { headers })
            .then((r) => r.json())
            .catch(() => book)
        );

        const detailedData = await Promise.all(detailPromises);

        const normalizedData = detailedData.map((book) => ({
          ...book,
          isAvailable:
            book.isAvailable === true ||
            book.isAvailable === 1 ||
            book.isAvailable === "true",
        }));

        setBooks(normalizedData);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDF5]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-10 border-b border-[#E2E9D1] pb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Library Collection
            </h1>
            <p className="text-sm font-medium text-[#87A96B] uppercase tracking-widest mt-2">
              Digital Archive Retrieval
            </p>
          </div>

          <div className="bg-white border border-[#E2E9D1] px-6 py-4 rounded-3xl shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
              Total Entries
            </p>
            <h2 className="text-3xl font-serif font-bold text-[#87A96B]">
              {books.length}
            </h2>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-40">
            <div className="text-[#87A96B] font-black animate-pulse text-xs uppercase tracking-[0.5em]">
              Accessing Archive...
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-400 font-medium italic">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {books.map((book) => (
              <div
                key={book.id}
                className="group bg-white border border-[#E2E9D1] rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-[#87A96B]/5 hover:-translate-y-1 transition-all duration-500"
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-[#EEF4E8] text-[#87A96B] px-4 py-2 rounded-full">
                    {book.category}
                  </span>
                  <span className="text-xs font-serif italic text-gray-400">
                    est. {book.published_year || book.year}
                  </span>
                </div>

                <div className="aspect-[4/3] bg-[#F1F4E8] rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                  <span className="text-7xl font-serif italic text-[#87A96B] opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    {book.title?.charAt(0)}
                  </span>
                </div>

                <h2 className="text-2xl font-serif font-bold text-gray-900 leading-tight group-hover:text-[#87A96B] transition-colors line-clamp-2">
                  {book.title}
                </h2>

                <p className="text-sm font-serif italic text-gray-500 mt-3 border-l-2 border-[#87A96B] pl-4">
                  by {book.author}
                </p>

                <div className="mt-8 pt-6 border-t border-[#F1F4E8]">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-tighter text-gray-300">
                      Status
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${
                        book.isAvailable ? "text-[#87A96B]" : "text-red-400"
                      }`}
                    >
                      {book.isAvailable ? "Available" : "Borrowed"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}