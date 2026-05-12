import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const role = localStorage.getItem("role");

      if (token && username) {
        setUser({
          username,
          role,
        });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null);
    window.location.href = "/";
  };

  const navLinkClass = (path) =>
    router.pathname === path
      ? "text-[#87A96B]"
      : "text-gray-400 hover:text-gray-800 transition-colors";

  const mobileNavClass = (path) =>
    router.pathname === path
      ? "text-[#87A96B]"
      : "text-gray-500 hover:text-gray-900";

  return (
    <header className="py-5 bg-white/60 backdrop-blur-xl border-b border-[#E2E9D1] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-[#87A96B] rounded-xl flex items-center justify-center text-white text-base font-bold shadow-lg shadow-[#87A96B]/20">
            L
          </div>
          <span className="text-sm sm:text-lg font-serif font-black tracking-[0.2em] text-gray-800 uppercase">
            Library
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-[11px] font-black uppercase tracking-[0.2em]">
          {!user && (
            <>
              <Link href="/" className={navLinkClass("/")}>
                Home
              </Link>
              <Link href="/login" className={navLinkClass("/login")}>
                Login
              </Link>
              <Link href="/register" className={navLinkClass("/register")}>
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <Link href="/books" className={navLinkClass("/books")}>
                Books
              </Link>

              {user.username === "admin_library" && (
                <>
                  <Link
                    href="/admin/books"
                    className={navLinkClass("/admin/books")}
                  >
                    Manage Books
                  </Link>
                  <Link
                    href="/admin/borrow-records"
                    className={navLinkClass("/admin/borrow-records")}
                  >
                    Records
                  </Link>
                </>
              )}

              <Link href="/graphql-demo" className={navLinkClass("/graphql-demo")}>
                GraphQL
              </Link>

              <Link href="/compare" className={navLinkClass("/compare")}>
                Compare
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-[#87A96B]">{user.username}</span>
                <span className="px-3 py-1 rounded-full bg-[#EEF4E8] text-[#87A96B] text-[9px]">
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors flex items-center"
                title="Logout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </>
          )}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1"
        >
          <span className="w-5 h-[2px] bg-gray-700 rounded-full"></span>
          <span className="w-5 h-[2px] bg-gray-700 rounded-full"></span>
          <span className="w-5 h-[2px] bg-gray-700 rounded-full"></span>
        </button>
      </div>

      {open && (
        <div className="md:hidden mt-5 px-6 pb-4">
          <nav className="bg-white border border-[#E2E9D1] rounded-2xl p-6 shadow-lg flex flex-col space-y-5 text-[11px] font-black uppercase tracking-[0.2em]">
            {!user && (
              <>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className={mobileNavClass("/")}
                >
                  Home
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={mobileNavClass("/login")}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className={mobileNavClass("/register")}
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                <Link
                  href="/books"
                  onClick={() => setOpen(false)}
                  className={mobileNavClass("/books")}
                >
                  Books
                </Link>

                {user.username === "admin_library" && (
                  <>
                    <Link
                      href="/admin/books"
                      onClick={() => setOpen(false)}
                      className={mobileNavClass("/admin/books")}
                    >
                      Manage Books
                    </Link>
                    <Link
                      href="/admin/borrow-records"
                      onClick={() => setOpen(false)}
                      className={mobileNavClass("/admin/borrow-records")}
                    >
                      Records
                    </Link>
                  </>
                )}

                <Link
                  href="/graphql-demo"
                  onClick={() => setOpen(false)}
                  className={mobileNavClass("/graphql-demo")}
                >
                  GraphQL
                </Link>

                <Link
                  href="/compare"
                  onClick={() => setOpen(false)}
                  className={mobileNavClass("/compare")}
                >
                  Compare
                </Link>

                <div className="flex items-center gap-3">
                  <span className="text-[#87A96B]">{user.username}</span>
                  <span className="px-3 py-1 rounded-full bg-[#EEF4E8] text-[#87A96B] text-[9px] w-fit">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-left text-gray-500 hover:text-red-500 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}