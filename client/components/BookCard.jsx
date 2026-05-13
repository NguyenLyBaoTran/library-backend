import Link from 'next/link';

export default function BookCard({ book }) {
  return (
    <Link href={`/books/${book.id}`} className="group block">
      <div className="bg-white rounded-xl p-3 border border-[#E2E9D1] hover:border-[#87A96B] hover:shadow-md transition-all duration-300">
        
        <div className="aspect-[3/4] bg-[#F1F4E8] rounded-lg mb-3 flex items-center justify-center text-[#87A96B] font-serif italic text-xl opacity-40 group-hover:opacity-100 transition-all">
          {book.title.charAt(0)}
        </div>
        
        <div className="space-y-0.5">
          <h3 className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-1 group-hover:text-[#87A96B]">
            {book.title}
          </h3>
          <p className="text-[10px] text-gray-400 font-medium truncate">
            {book.author}
          </p>
          
          <div className="pt-2 flex justify-between items-center border-t border-[#F1F4E8] mt-2">
            <span className="text-[9px] font-bold text-[#A8BD75]">{book.published_year}</span>
            <span className="text-[9px] font-black text-[#87A96B] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
              Open →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}