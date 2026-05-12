import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

export default function BookDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady || !id) return;
    fetchBook();
  }, [id, router.isReady]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://library-backend-production-244f.up.railway.app/api/books/${id}`
      );
      if (!response.ok) throw new Error("Book not found");
      const data = await response.json();
      setBook({
        ...data,
        available: data.available ?? data.isAvailable ?? true,
      });
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    try {
      setBorrowing(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        router.push("/login");
        return;
      }
      const response = await fetch(
        "https://library-backend-production-244f.up.railway.app/graphql",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              mutation {
                borrowBook(book_id: "${id}") {
                  id
                  user_id
                  book_id
                  borrow_date
                  status
                }
              }
            `,
          }),
        }
      );
      const result = await response.json();
      if (result.errors) throw new Error(result.errors[0].message);
      alert("Book borrowed successfully!");
      setBook((prev) => ({ ...prev, available: false }));
    } catch (err) {
      console.log(err);
      alert("Borrow failed");
    } finally {
      setBorrowing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#FDFDF5]">
        <Navbar />
        <div className="flex items-center justify-center pt-40">
          <div className="text-[#87A96B] font-black animate-pulse text-xs uppercase tracking-[0.5em]">
            Accessing Archive...
          </div>
        </div>
      </div>
    );

  if (error || !book)
    return (
      <div className="min-h-screen bg-[#FDFDF5]">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-40">
          <h1 className="text-4xl font-bold text-gray-800">Book Not Found</h1>
          <p className="text-gray-500 mt-4">Unable to retrieve archive record.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFDF5]">
      <Navbar />
      <div className="py-10 lg:py-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.push("/books")}
            className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-[#87A96B] hover:text-gray-900 transition-colors mb-8 lg:mb-16"
          >
            <span className="mr-3 text-base">←</span> Return to Archive
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">
            <div className="lg:col-span-5 md:max-w-sm md:mx-auto lg:max-w-none order-2 lg:order-1 w-full">
              <div className="bg-white rounded-[2.5rem] p-4 lg:p-5 border border-[#E2E9D1] shadow-xl shadow-[#87A96B]/5">
                <div className="aspect-[3/4] bg-[#F1F4E8] rounded-[2rem] flex items-center justify-center relative overflow-hidden group">
                  <div className="text-[80px] lg:text-[120px] font-serif italic text-[#87A96B] opacity-10 select-none group-hover:opacity-20 transition-opacity duration-500">
                    {book.title?.charAt(0)}
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8 bg-gradient-to-t from-[#F1F4E8] via-transparent to-transparent">
                    <h3 className="text-base lg:text-lg font-serif font-bold text-gray-800 leading-tight mb-1 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-[10px] lg:text-xs text-[#87A96B] font-medium italic truncate">
                      {book.author}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="space-y-6 lg:space-y-8">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] ${
                        book.available
                          ? "bg-[#EEF4E8] text-[#87A96B]"
                          : "bg-red-50 text-red-400"
                      }`}
                    >
                      {book.available ? "Available" : "Borrowed"}
                    </span>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{book.category}</span>
                  </div>

                  <h1 className="text-3xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight lg:tracking-tighter mb-4 break-words">
                    {book.title}
                  </h1>

                  <p className="text-lg lg:text-2xl font-serif italic text-[#87A96B]">
                    by {book.author}
                  </p>
                </div>

                <div className="pt-8 lg:pt-12 space-y-8 lg:space-y-10 border-t border-[#E2E9D1]">
                  <div className="flex gap-10 lg:gap-16">
                    <div>
                      <h4 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">
                        Published
                      </h4>
                      <p className="text-base lg:text-lg font-bold text-gray-800">
                        {book.published_year}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">
                        Archive ID
                      </h4>
                      <p className="text-base lg:text-lg font-bold text-gray-800">
                        #{id?.toString().padStart(4, '0')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4">
                      Description
                    </h4>
                    <p className="text-sm lg:text-lg text-gray-500 leading-relaxed font-medium italic">
                      This archive entry belongs to <span className="text-gray-900 font-bold">"{book.title}"</span>. 
                      A significant addition to our collection, available for academic reference and personal growth.
                    </p>
                  </div>

                  <div className="pt-4 lg:pt-6">
                    {book.available ? (
                      <button
                        onClick={handleBorrow}
                        disabled={borrowing}
                        className="w-full lg:w-auto px-10 py-3.5 lg:py-4 bg-[#2D3436] text-white rounded-xl lg:rounded-2xl text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[#87A96B] transition-all transform hover:-translate-y-1 active:scale-95"
                      >
                        {borrowing ? "Processing..." : "Borrow Book"}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full lg:w-auto px-10 py-3.5 lg:py-4 bg-gray-100 text-gray-400 rounded-xl lg:rounded-2xl text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] cursor-not-allowed border border-gray-200"
                      >
                        Currently Borrowed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}