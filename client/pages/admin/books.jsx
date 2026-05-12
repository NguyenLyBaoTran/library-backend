import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

const API_URL = "https://library-backend-production-244f.up.railway.app/api/books";

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    published_year: "",
  });

  const fetchBooks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const normalizedData = data.map(book => ({
        ...book,
        available: book.available ?? book.isAvailable ?? true
      }));
      setBooks(normalizedData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          published_year: Number(form.published_year),
          available: true,
        }),
      });
      setForm({ title: "", author: "", category: "", published_year: "" });
      fetchBooks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this book?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchBooks();
    } catch (err) {
      console.log(err);
    }
  };

  const openEditModal = (book) => {
    setEditingBook({
      ...book,
      available: book.available ?? book.isAvailable ?? true
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/${editingBook.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editingBook.title,
          author: editingBook.author,
          category: editingBook.category,
          published_year: Number(editingBook.published_year),
          isAvailable: editingBook.available,
          available: editingBook.available,
        }),
      });

      if (response.ok) {
        await fetchBooks();
        setIsModalOpen(false);
        setEditingBook(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDF5]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-5xl font-serif font-bold text-gray-900 italic tracking-tight">Manage Books</h2>
          <p className="mt-3 text-gray-500">Add, edit and remove library books.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <form onSubmit={handleCreate} className="bg-white border border-[#E2E9D1] rounded-3xl p-8 space-y-5 sticky top-28 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800">Add New Book</h2>
              <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-4 rounded-xl border border-[#DDE5CF] outline-none focus:border-[#87A96B]" required />
              <input type="text" placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full p-4 rounded-xl border border-[#DDE5CF] outline-none focus:border-[#87A96B]" required />
              <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full p-4 rounded-xl border border-[#DDE5CF] outline-none focus:border-[#87A96B]" />
              <input type="number" placeholder="Published Year" value={form.published_year} onChange={(e) => setForm({ ...form, published_year: e.target.value })} className="w-full p-4 rounded-xl border border-[#DDE5CF] outline-none focus:border-[#87A96B]" />
              <button type="submit" className="w-full bg-[#87A96B] hover:bg-[#76945E] text-white py-4 rounded-2xl font-bold transition shadow-lg shadow-[#87A96B]/20">Add Book</button>
            </form>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white border border-[#E2E9D1] rounded-3xl overflow-hidden flex flex-col max-h-[700px] shadow-sm">
              <div className="grid grid-cols-5 gap-4 px-6 py-5 border-b border-[#E2E9D1] bg-[#F8FAF5] text-[11px] uppercase tracking-[0.2em] font-black text-gray-400 sticky top-0 z-10">
                <div>Title</div>
                <div>Author</div>
                <div>Category</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              <div className="overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="p-10 text-center text-gray-400 animate-pulse font-bold uppercase tracking-widest">Loading...</div>
                ) : (
                  books.map((book) => (
                    <div key={book.id} className="grid grid-cols-5 gap-4 px-6 py-5 border-b border-[#F3F3F3] items-center hover:bg-[#FDFDF5] transition-colors">
                      <div className="font-semibold text-gray-800 truncate pr-2" title={book.title}>{book.title}</div>
                      <div className="text-gray-500 truncate pr-2">{book.author}</div>
                      <div className="text-gray-500">{book.category}</div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${book.available ? "bg-[#EEF4E8] text-[#87A96B]" : "bg-red-100 text-red-500"}`}>
                          {book.available ? "Available" : "Borrowed"}
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => openEditModal(book)} className="text-[#87A96B] hover:text-gray-900 text-[10px] font-black uppercase tracking-[0.1em] transition-colors">Edit</button>
                        <button onClick={() => handleDelete(book.id)} className="text-red-400 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.1em] transition-colors">Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && editingBook && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <form onSubmit={handleUpdate} className="relative bg-white border border-[#E2E9D1] w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Edit Archive</h2>
            <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 block">Title</label>
                <input type="text" value={editingBook.title} onChange={(e) => setEditingBook({...editingBook, title: e.target.value})} className="w-full p-3 rounded-xl border border-[#DDE5CF] outline-none focus:border-[#87A96B] transition-colors font-medium text-gray-800" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 block">Author</label>
                  <input type="text" value={editingBook.author} onChange={(e) => setEditingBook({...editingBook, author: e.target.value})} className="w-full p-3 rounded-xl border border-[#DDE5CF] outline-none focus:border-[#87A96B] transition-colors font-medium text-gray-800" required />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 block">Year</label>
                  <input type="number" value={editingBook.published_year} onChange={(e) => setEditingBook({...editingBook, published_year: e.target.value})} className="w-full p-3 rounded-xl border border-[#DDE5CF] outline-none focus:border-[#87A96B] transition-colors font-medium text-gray-800" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 block">Category</label>
                <input type="text" value={editingBook.category} onChange={(e) => setEditingBook({...editingBook, category: e.target.value})} className="w-full p-3 rounded-xl border border-[#DDE5CF] outline-none focus:border-[#87A96B] transition-colors font-medium text-gray-800" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Status</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditingBook({...editingBook, available: true})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${editingBook.available ? "bg-[#87A96B] text-white shadow-lg shadow-[#87A96B]/20" : "bg-gray-100 text-gray-400"}`}>Available</button>
                  <button type="button" onClick={() => setEditingBook({...editingBook, available: false})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${!editingBook.available ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-gray-100 text-gray-400"}`}>Borrowed</button>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-800 transition-colors">Cancel</button>
              <button type="submit" className="flex-1 bg-[#2D3436] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#87A96B] transition-all">Save Archive</button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E9D1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #87A96B; }
      `}</style>
    </div>
  );
}