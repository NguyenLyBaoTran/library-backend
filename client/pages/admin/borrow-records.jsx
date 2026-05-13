import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

export default function BorrowRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      };

      const resBooksGraphQL = await fetch(
        `https://library-backend-production-244f.up.railway.app/graphql`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            query: `query { getAllBooks { id title isAvailable } }`,
          }),
        }
      );

      const resultGraphQL = await resBooksGraphQL.json();
      const allBooks = resultGraphQL.data?.getAllBooks || [];

      const detailPromises = allBooks.map((book) =>
        fetch(
          `https://library-backend-production-244f.up.railway.app/api/books/${book.id}`,
          { headers }
        )
          .then((res) => res.json())
          .catch(() => null)
      );

      const detailedBooks = await Promise.all(detailPromises);
      const latestRecordsMap = new Map();

      detailedBooks.forEach((book) => {
        if (book && book.borrow_records && book.borrow_records.length > 0) {
          const sortedBookRecords = [...book.borrow_records].sort(
            (a, b) => b.id - a.id
          );
          const latestRec = sortedBookRecords[0];
          const borrowTime = new Date(
            latestRec.borrow_date || latestRec.createdAt
          );

          latestRecordsMap.set(book.id, {
            ...latestRec,
            book_title: book.title,
            finalStatus: book.isAvailable ? "returned" : "borrowed",
            displayBorrowDate: borrowTime.toISOString(),
          });
        }
      });

      setRecords(
        Array.from(latestRecordsMap.values()).sort(
          (a, b) => new Date(b.displayBorrowDate) - new Date(a.displayBorrowDate)
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const formatDT = (str) => {
    if (!str) return "N/A";
    const date = new Date(str);
    return date.toLocaleString("en-GB", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFDF5]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10 sm:mb-12">
          <div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 italic tracking-tight">
              Library History
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-500 font-medium italic">
              Unique activity log focused on User IDs.
            </p>
          </div>

          <button
            onClick={fetchRecords}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-[#87A96B] hover:text-gray-900 transition-all border border-[#E2E9D1] sm:border-none px-4 py-2 sm:p-0 rounded-full"
          >
            Refresh Data
          </button>
        </div>

        <div className="bg-white border border-[#E2E9D1] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm">
          <div className="hidden sm:grid grid-cols-4 gap-4 px-10 py-7 border-b border-[#E2E9D1] bg-[#F8FAF5] text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 sticky top-0 z-10">
            <div>User ID</div>
            <div>Book Title</div>
            <div>Status</div>
            <div>Borrow Date</div>
          </div>

          <div className="overflow-y-auto max-h-[600px] sm:max-h-[750px] custom-scrollbar">
            {loading ? (
              <div className="p-20 text-center text-[#87A96B] font-black uppercase tracking-[0.5em] animate-pulse text-xs">
                Syncing...
              </div>
            ) : (
              records.map((record) => (
                <div
                  key={record.id}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 sm:px-10 py-6 sm:py-8 border-b border-[#F8FAF5] items-center hover:bg-[#FDFDF5] transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <span className="sm:hidden text-[9px] font-black uppercase text-gray-400 tracking-widest">User</span>
                    <span className="w-fit px-3 py-1 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs">
                      #{record.user_id}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 col-span-1 sm:col-span-1">
                    <span className="sm:hidden text-[9px] font-black uppercase text-gray-400 tracking-widest">Book</span>
                    <div className="text-gray-600 font-serif italic truncate text-sm sm:text-base">
                      {record.book_title}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:block">
                    <span className="sm:hidden text-[9px] font-black uppercase text-gray-400 tracking-widest">Status</span>
                    <span
                      className={`w-fit px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        record.finalStatus === "returned"
                          ? "bg-gray-100 text-gray-400"
                          : "bg-[#EEF4E8] text-[#87A96B]"
                      }`}
                    >
                      {record.finalStatus}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="sm:hidden text-[9px] font-black uppercase text-gray-400 tracking-widest">Date</span>
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#87A96B]"></div>
                      <span className="text-[10px] font-bold text-gray-600">
                        {formatDT(record.displayBorrowDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e9d1; border-radius: 10px; }
      `}</style>
    </div>
  );
}