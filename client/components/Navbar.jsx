import Link from "next/link";

export default function Navbar() {
  return (
    <header className="py-6 bg-white/60 backdrop-blur-xl border-b border-[#E2E9D1] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">

        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-[#87A96B] rounded-xl flex items-center justify-center text-white text-base font-bold shadow-lg shadow-[#87A96B]/20">
            L
          </div>

          <span className="text-lg font-serif font-black tracking-widest text-gray-800 uppercase">
            Library System
          </span>
        </div>

        <nav className="flex items-center space-x-8 text-xs font-black uppercase tracking-[0.2em]">

          <Link
            href="/"
            className="text-[#87A96B] hover:text-[#6E8B57] transition-colors"
          >
            Home
          </Link>

          <Link
            href="/books"
            className="text-gray-400 hover:text-gray-800 transition-colors"
          >
            Books
          </Link>

          <Link
            href="/graphql-demo"
            className="text-gray-400 hover:text-gray-800 transition-colors"
          >
            GraphQL
          </Link>

          <Link
            href="/compare"
            className="text-gray-400 hover:text-gray-800 transition-colors"
          >
            Compare
          </Link>

          <Link
            href="/login"
            className="text-gray-400 hover:text-gray-800 transition-colors"
          >
            Login
          </Link>

        </nav>
      </div>
    </header>
  );
}