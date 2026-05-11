import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function BookDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null); // Thêm state để quản lý lỗi UI

  useEffect(() => {
    if (!router.isReady || !id) return;

    if (id === "sample-01") {
      setBook({
        title: "The Art of Mindful Programming",
        author: "Elena Rose",
        published_year: 2024,
        isbn: "978-3-16-148410-0",
        description: "A comprehensive guide to building software with focus and clarity in a distracted world."
      });
      return;
    }

    fetch(`http://localhost:5000/api/books/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Entry not found in archive");
        return res.json();
      })
      .then(data => {
        setBook({
          ...data,
          published_year: data.published_year || data.publishedYear || "N/A",
          isbn: data.isbn || "UNASSIGNED",
          description: data.description || "No abstract available for this record."
        });
      })
      .catch(err => {
        console.error("API Error:", err);
        setError(true);
        setBook({
          title: "Archive Sync Error",
          author: "System",
          description: "We couldn't retrieve the specific records from the library server at this moment."
        });
      });
  }, [id, router.isReady]);

  if (!book) return (
    <div className="min-h-screen bg-[#FDFDF5] flex items-center justify-center">
      <div className="text-[#87A96B] font-black animate-pulse text-xs uppercase tracking-[0.5em]">
        Accessing Archive...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDF5] py-10 lg:py-20 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => router.push('/books')} // Dùng push quay lại danh sách cho chắc chắn
          className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-[#87A96B] hover:text-gray-900 transition-colors mb-8 lg:mb-16"
        >
          <span className="mr-3 text-base">←</span> Return to Archive
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">
          {/* Cột Trái: Ảnh bìa (Reference Box) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className={`aspect-[3/4] bg-white rounded-[2rem] lg:rounded-[3rem] shadow-xl shadow-[#87A96B]/5 border border-[#E2E9D1] flex items-center justify-center relative overflow-hidden transition-all ${error ? 'grayscale' : ''}`}>
              <div className="text-[80px] lg:text-[140px] font-serif italic text-[#87A96B] opacity-10 select-none">
                {book.title?.charAt(0)}
              </div>
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 border-l-2 border-[#87A96B] pl-4">
                <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Reference Copy</p>
                <p className="text-[8px] lg:text-[9px] font-medium text-[#A8BD75] mt-1 italic">TDTU Faculty of IT</p>
              </div>
            </div>
          </div>

          {/* Cột Phải: Nội dung */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="space-y-6 lg:space-y-8">
              <div>
                <h1 className="text-4xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.1] lg:leading-[0.9] tracking-tight lg:tracking-tighter mb-4 break-words">
                  {book.title}
                </h1>
                <p className="text-xl lg:text-3xl font-serif italic text-[#87A96B]">
                  by {book.author}
                </p>
              </div>
              
              <div className="pt-8 lg:pt-12 space-y-8 lg:space-y-10 border-t border-[#E2E9D1]">
                <div className="flex gap-10 lg:gap-16">
                  <div>
                    <h4 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">Registry</h4>
                    <p className="text-lg lg:text-xl font-bold text-gray-800">{book.published_year}</p>
                  </div>
                  <div>
                    <h4 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2">Standard Code</h4>
                    <p className="text-lg lg:text-xl font-bold text-gray-800 tracking-tighter uppercase">{book.isbn?.split('-')[0]}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4">Abstract</h4>
                  <p className="text-base lg:text-xl text-gray-500 leading-relaxed font-medium italic">
                    "{book.description}"
                  </p>
                </div>

                <div className="pt-4 lg:pt-6">
                  <button className="w-full lg:w-auto px-10 py-4 lg:py-5 bg-[#2D3436] text-white rounded-xl lg:rounded-2xl text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[#87A96B] transition-all transform hover:-translate-y-1 active:scale-95">
                    Reserve Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}