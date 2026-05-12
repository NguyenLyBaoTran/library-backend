import { useEffect, useMemo, useState } from "react";
import BookCard from "../../components/BookCard";
import Navbar from "../../components/Navbar";

export default function BookListPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("https://library-backend-production-244f.up.railway.app/api/books")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          setBooks([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setBooks([]);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = books
      .map((book) => book.category?.trim())
      .filter(Boolean);

    return [
      "All",
      ...[...new Set(uniqueCategories)].sort(),
    ];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory = selectedCategory === "All" || book.category?.trim() === selectedCategory;
      const matchesSearch = 
        book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [books, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDFDF5]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        <div className="mb-14 border-b border-[#E2E9D1] pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-5xl lg:text-6xl font-serif font-bold text-gray-900 tracking-tighter mb-4 italic">
              Library
            </h2>
            <p className="text-xs lg:text-sm text-[#A8BD75] font-black tracking-[0.2em] uppercase italic">
              Curated Digital Database
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E2E9D1] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#87A96B]/20 focus:border-[#87A96B] transition-all shadow-sm italic font-medium"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#87A96B]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-3 space-y-10">
            <section>
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">
                Categories
              </h4>

              <div className="flex lg:flex-col gap-3 lg:gap-1 overflow-x-auto lg:overflow-visible pb-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedCategory(item)}
                    className={`group flex items-center whitespace-nowrap text-[12px] font-bold transition-all px-5 py-3 rounded-2xl lg:rounded-xl ${
                      selectedCategory === item
                        ? "bg-[#EEF4E8] text-[#87A96B]"
                        : "bg-white text-gray-500 border border-[#E2E9D1] hover:bg-[#F8FAF5] lg:bg-transparent lg:border-transparent"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-3 transition-all ${
                        selectedCategory === item
                          ? "bg-[#87A96B] scale-125"
                          : "bg-gray-300 group-hover:bg-[#87A96B]"
                      }`}
                    ></span>
                    {item}
                  </button>
                ))}
              </div>
            </section>
          </aside>

          <div className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-72 bg-white animate-pulse rounded-[2rem] border border-[#E2E9D1]"
                  ></div>
                ))}
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="bg-white border border-[#E2E9D1] rounded-[3rem] p-20 text-center shadow-sm">
                <h3 className="text-3xl font-serif font-bold text-gray-800 italic">
                  No Books Found
                </h3>
                <p className="text-gray-400 mt-4 font-medium italic">
                  We couldn't find any results for "{searchQuery || selectedCategory}".
                </p>
                <button 
                  onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}
                  className="mt-8 text-[10px] font-black uppercase tracking-widest text-[#87A96B] underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {filteredBooks.map((book) => (
                  <div key={book.id} className="transition-transform duration-500 hover:-translate-y-2">
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}