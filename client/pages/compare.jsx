import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function ComparePage() {
  const [restBooks, setRestBooks] = useState([]);
  const [graphqlBooks, setGraphqlBooks] = useState([]);
  const [restTime, setRestTime] = useState(0);
  const [graphqlTime, setGraphqlTime] = useState(0);
  const [restPayload, setRestPayload] = useState(0);
  const [graphqlPayload, setGraphqlPayload] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchRestData(), fetchGraphQLData()]);
    setLoading(false);
  };

  const fetchRestData = async () => {
    try {
      const start = performance.now();
      const response = await fetch(
        "https://library-backend-production-244f.up.railway.app/api/books"
      );
      const data = await response.json();
      const end = performance.now();

      setRestBooks(data || []);
      setRestTime((end - start).toFixed(2));
      setRestPayload(new Blob([JSON.stringify(data)]).size);
    } catch (error) {
      setRestBooks([]);
    }
  };

  const fetchGraphQLData = async () => {
    try {
      const start = performance.now();
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://library-backend-production-244f.up.railway.app/graphql",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            query: `
              query {
                getAllBooks {
                  id
                  title
                  author
                  category
                  year
                }
              }
            `, 
          }),
        }
      );

      const result = await response.json();
      const end = performance.now();

      if (result?.data?.getAllBooks) {
        setGraphqlBooks(result.data.getAllBooks);
      } else {
        setGraphqlBooks([]);
      }

      setGraphqlTime((end - start).toFixed(2));
      setGraphqlPayload(new Blob([JSON.stringify(result)]).size);
    } catch (error) {
      setGraphqlBooks([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDF5]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-12 border-b border-[#E2E9D1] pb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900">
              API Comparison
            </h1>
            <p className="text-[#87A96B] font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
              Performance & Payload Analysis
            </p>
          </div>

          <div className="bg-white border border-[#E2E9D1] rounded-2xl px-6 py-4 shadow-sm">
            <p className="text-[10px] font-black uppercase text-gray-400">Database Size</p>
            <h2 className="text-3xl font-serif font-bold text-[#87A96B]">
              {restBooks.length}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-40">
            <div className="text-[#87A96B] font-black animate-pulse text-xs uppercase tracking-[0.5em]">
              Analyzing Metrics...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white border border-[#E2E9D1] rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-[#87A96B]/5">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900">REST API</h2>
                <span className="bg-[#EEF4E8] text-[#87A96B] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Traditional
                </span>
              </div>

              <div className="space-y-4">
                <MetricRow label="Endpoint" value="GET /api/books" />
                <MetricRow label="Response Time" value={`${restTime} ms`} />
                <MetricRow label="Payload Size" value={`${restPayload} bytes`} />
                <MetricRow label="Total Books" value={restBooks.length} isLast />
              </div>

              <div className="mt-10">
                <h3 className="text-[10px] font-black uppercase text-gray-300 mb-4 tracking-widest">Sample Response</h3>
                <div className="bg-[#F1F4E8] rounded-2xl p-6 overflow-auto max-h-[220px] text-[11px] font-mono text-gray-700 leading-relaxed border border-[#E2E9D1]">
                  <pre>{JSON.stringify(restBooks?.[0] || {}, null, 2)}</pre>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E2E9D1] rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-[#87A96B]/5">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900">GraphQL API</h2>
                <span className="bg-[#EEF4E8] text-[#87A96B] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Flexible
                </span>
              </div>

              <div className="space-y-4">
                <MetricRow label="Endpoint" value="POST /graphql" />
                <MetricRow label="Response Time" value={`${graphqlTime} ms`} />
                <MetricRow label="Payload Size" value={`${graphqlPayload} bytes`} />
                <MetricRow label="Total Books" value={graphqlBooks.length} isLast />
              </div>

              <div className="mt-10">
                <h3 className="text-[10px] font-black uppercase text-gray-300 mb-4 tracking-widest">Sample Response</h3>
                <div className="bg-[#F1F4E8] rounded-2xl p-6 overflow-auto max-h-[220px] text-[11px] font-mono text-gray-700 leading-relaxed border border-[#E2E9D1]">
                  {graphqlBooks.length > 0 ? (
                    <pre>{JSON.stringify(graphqlBooks?.[0] || {}, null, 2)}</pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-50">
                      <p className="text-xs font-bold uppercase tracking-widest text-red-400">Fetch Failed</p>
                      <p className="text-[10px] mt-1 text-gray-400 text-center px-4">Đảm bảo bạn đã đăng nhập và tên field khớp với Schema</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white border border-[#E2E9D1] rounded-[2.5rem] p-10 shadow-sm mt-12">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-8">Comparative Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnalysisCard 
              title="Over-fetching" 
              desc="REST API trả về toàn bộ object ngay cả khi chỉ cần một phần dữ liệu, làm tăng tải trọng không cần thiết."
            />
            <AnalysisCard 
              title="Under-fetching" 
              desc="GraphQL ngăn chặn việc phải gửi nhiều yêu cầu bằng cách cho phép bạn xác định chính xác các trường mình cần."
            />
            <AnalysisCard 
              title="Efficiency" 
              desc="GraphQL thường có kích thước payload nhỏ hơn vì dữ liệu được chọn lọc ngay từ phía server."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value, isLast }) {
  return (
    <div className={`flex justify-between items-center py-4 ${!isLast ? 'border-b border-[#F1F4E8]' : ''}`}>
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-bold text-gray-800">{value}</span>
    </div>
  );
}

function AnalysisCard({ title, desc }) {
  return (
    <div className="bg-[#F1F4E8] rounded-2xl p-6 border border-[#E2E9D1]/50">
      <h3 className="font-serif font-bold text-[#87A96B] text-lg mb-2">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed italic">{desc}</p>
    </div>
  );
}