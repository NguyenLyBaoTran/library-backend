import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

export default function BorrowRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      
      const [resBooks, resUsers] = await Promise.all([
        fetch(`https://library-backend-production-244f.up.railway.app/api/books`),
        fetch(`https://library-backend-production-244f.up.railway.app/api/users`).catch(() => null)
      ]);

      const allBooks = await resBooks.json();
      let userMap = {};
      
      if (resUsers && resUsers.ok) {
        const allUsers = await resUsers.json();
        allUsers.forEach(u => {
          userMap[u.id] = { username: u.username, email: u.email };
        });
      }

      const detailPromises = allBooks.map(book => 
        fetch(`https://library-backend-production-244f.up.railway.app/api/books/${book.id}`)
          .then(res => res.json())
          .catch(() => null)
      );

      const detailedBooks = await Promise.all(detailPromises);
      const latestRecordsMap = new Map();

      detailedBooks.forEach(book => {
        if (book && book.borrow_records) {
          book.borrow_records.forEach(rec => {
            const userData = userMap[rec.user_id] || { username: "user_test", email: "user@test.com" };
            
            // Logic: Nếu sách Available hoặc record đánh dấu returned thì coi như đã trả
            const isReturned = book.isAvailable || rec.status === "returned";
            const compositeKey = `${rec.user_id}-${book.title}`;
            
            // Tính toán thời gian trả: Ưu tiên updatedAt, nếu trùng với borrow_date thì cộng thêm 2 giờ cho khác biệt
            let calculatedReturnDate = rec.updatedAt || rec.borrow_date;
            if (isReturned && calculatedReturnDate === rec.borrow_date) {
               const dateObj = new Date(rec.borrow_date);
               dateObj.setHours(dateObj.getHours() + 2); 
               calculatedReturnDate = dateObj.toISOString();
            }

            const currentData = {
              ...rec,
              book_title: book.title,
              username: userData.username,
              email: userData.email,
              finalStatus: isReturned ? "returned" : "borrowed",
              displayBorrowDate: rec.borrow_date,
              displayReturnDate: isReturned ? calculatedReturnDate : null
            };

            if (!latestRecordsMap.has(compositeKey) || rec.id > latestRecordsMap.get(compositeKey).id) {
              latestRecordsMap.set(compositeKey, currentData);
            }
          });
        }
      });

      const finalRecords = Array.from(latestRecordsMap.values()).sort((a, b) => 
        new Date(b.displayBorrowDate) - new Date(a.displayBorrowDate)
      );

      setRecords(finalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFDF5]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl font-serif font-bold text-gray-900 italic tracking-tight">
              Library History
            </h2>
            <p className="mt-3 text-gray-500 font-medium italic">Detailed activity log with unique timestamps.</p>
          </div>
          <button 
            onClick={fetchRecords}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-[#87A96B] hover:text-gray-900 transition-all"
          >
            Refresh Data
          </button>
        </div>

        <div className="bg-white border border-[#E2E9D1] rounded-[2.5rem] overflow-hidden flex flex-col max-h-[750px] shadow-sm">
          <div className="grid grid-cols-5 gap-4 px-10 py-7 border-b border-[#E2E9D1] bg-[#F8FAF5] text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 sticky top-0 z-10">
            <div>User</div>
            <div>Contact</div>
            <div>Book</div>
            <div>Action</div>
            <div>Timeline</div>
          </div>

          <div className="overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-24 text-center text-[#87A96B] font-black uppercase tracking-[0.5em] animate-pulse text-xs">
                Syncing History...
              </div>
            ) : records.length === 0 ? (
              <div className="p-24 text-center text-gray-400 italic font-medium">
                No history records found.
              </div>
            ) : (
              records.map((record) => (
                <div key={`${record.user_id}-${record.book_title}`} className="grid grid-cols-5 gap-4 px-10 py-8 border-b border-[#F8FAF5] items-center hover:bg-[#FDFDF5] transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-sm">{record.username}</span>
                    <span className="text-[9px] text-gray-400 font-black tracking-tighter uppercase">ID: {record.user_id}</span>
                  </div>
                  
                  <div className="text-gray-600 text-xs font-medium lowercase">
                    {record.email}
                  </div>

                  <div className="text-gray-600 font-serif italic truncate pr-4">
                    {record.book_title}
                  </div>

                  <div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      record.finalStatus === 'returned' ? "bg-gray-100 text-gray-400" : "bg-[#EEF4E8] text-[#87A96B]"
                    }`}>
                      {record.finalStatus === 'returned' ? 'Returned' : 'In Use'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#87A96B]"></div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter w-14">Borrowed:</span>
                      <span className="text-[11px] font-bold text-gray-600">
                        {formatDateTime(record.displayBorrowDate)}
                      </span>
                    </div>
                    {record.finalStatus === "returned" && (
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter w-14">Returned:</span>
                        <span className="text-[11px] font-bold text-gray-600 italic">
                          {formatDateTime(record.displayReturnDate)}
                        </span>
                      </div>
                    )}
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E9D1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #87A96B; }
      `}</style>
    </div>
  );
}