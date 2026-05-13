import Link from "next/link";

import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFDF5]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 lg:px-8 pt-6 pb-24">

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#87A96B] mb-6">
              Digital Library Archive
            </p>

            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.05] tracking-tight">
              Library
              <span className="block italic text-[#87A96B]">
                Management
              </span>
              System
            </h1>

            <p className="mt-8 text-lg text-gray-500 leading-relaxed max-w-xl">
              A modern library platform powered by
              REST API and GraphQL architecture.
              Browse books, borrow entries, and
              explore API performance comparison
              through a clean digital archive
              experience.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <Link
                href="/login"
                className="px-8 py-4 bg-[#2D3436] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] shadow-xl hover:bg-[#87A96B] transition-all hover:-translate-y-1"
              >
                Explore Library
              </Link>

            </div>
          </div>

          <div className="relative">

            <div className="min-h-[620px] lg:min-h-0 bg-white rounded-[3rem] border border-[#E2E9D1] shadow-2xl shadow-[#87A96B]/5 overflow-hidden p-8 md:p-10 flex flex-col justify-between">

              <div className="space-y-8">

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                      Archive Status
                    </p>

                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-4">
                      Online
                    </h3>
                  </div>

                  <div className="w-4 h-4 rounded-full bg-[#87A96B] animate-pulse"></div>
                </div>

                <div className="bg-[#F8FAF5] border border-[#E2E9D1] rounded-2xl p-5">
                  <p className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 mb-2">
                    API Architecture
                  </p>

                  <h4 className="text-2xl md:text-3xl font-bold text-gray-800">
                    REST + GraphQL
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-[#F8FAF5] border border-[#E2E9D1] rounded-2xl p-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 mb-2">
                      Books
                    </p>

                    <h4 className="text-2xl md:text-3xl font-bold text-[#87A96B]">
                      30+
                    </h4>
                  </div>

                  <div className="bg-[#F8FAF5] border border-[#E2E9D1] rounded-2xl p-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 mb-2">
                      Access
                    </p>

                    <h4 className="text-2xl md:text-3xl font-bold text-[#87A96B]">
                      Secure
                    </h4>
                  </div>

                </div>

                <div className="bg-[#F8FAF5] border border-[#E2E9D1] rounded-2xl p-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 mb-4">
                    System Features
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Book Borrowing
                      </span>

                      <span className="font-bold text-[#87A96B]">
                        Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Authentication
                      </span>

                      <span className="font-bold text-[#87A96B]">
                        JWT Enabled
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Database
                      </span>

                      <span className="font-bold text-[#87A96B]">
                        MySQL
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="border-t border-[#E2E9D1] pt-6 mt-10">
                <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold">
                  TDTU Faculty of Information Technology
                </p>
              </div>

            </div>

            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#EEF4E8] rounded-full blur-3xl opacity-70"></div>

            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#F3F7ED] rounded-full blur-3xl opacity-80"></div>

          </div>

        </section>
      </main>
    </div>
  );
}