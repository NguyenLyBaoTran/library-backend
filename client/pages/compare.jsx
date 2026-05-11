import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

export default function ComparePage() {
  const [restBooks, setRestBooks] = useState([]);
  const [graphqlBooks, setGraphqlBooks] = useState([]);

  const [restTime, setRestTime] = useState(0);
  const [graphqlTime, setGraphqlTime] = useState(0);

  const [restPayload, setRestPayload] = useState(0);
  const [graphqlPayload, setGraphqlPayload] = useState(0);

  useEffect(() => {
    fetchRestData();
    fetchGraphQLData();
  }, []);

  const fetchRestData = async () => {
    try {
      const start = performance.now();

      const response = await fetch(
        "http://localhost:5000/api/books"
      );

      const data = await response.json();

      const end = performance.now();

      setRestBooks(data || []);

      setRestTime((end - start).toFixed(2));

      setRestPayload(
        new Blob([JSON.stringify(data || [])]).size
      );
    } catch (error) {
      console.log(error);

      setRestBooks([]);
    }
  };

  const fetchGraphQLData = async () => {
    try {
      const start = performance.now();

      const response = await fetch(
        "http://localhost:5000/graphql",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            query: `
              query {
                getAllBooks {
                  title
                  author
                }
              }
            `,
          }),
        }
      );

      const result = await response.json();

      const end = performance.now();

      const data =
        result?.data?.getAllBooks || [];

      setGraphqlBooks(data);

      setGraphqlTime(
        (end - start).toFixed(2)
      );

      setGraphqlPayload(
        new Blob([JSON.stringify(data)]).size
      );
    } catch (error) {
      console.log(error);

      setGraphqlBooks([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5]">
      <Navbar />

      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-10">
          REST vs GraphQL Comparison
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="bg-white border border-[#E2E9D1] rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">
              REST API
            </h2>

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">
                  Endpoint:
                </span>{" "}
                GET /api/books
              </p>

              <p>
                <span className="font-semibold">
                  Response Time:
                </span>{" "}
                {restTime} ms
              </p>

              <p>
                <span className="font-semibold">
                  Payload Size:
                </span>{" "}
                {restPayload} bytes
              </p>

              <p>
                <span className="font-semibold">
                  Total Books:
                </span>{" "}
                {restBooks?.length || 0}
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl mt-6 text-sm overflow-auto">
              <pre>
                {JSON.stringify(
                  restBooks?.[0] || {},
                  null,
                  2
                )}
              </pre>
            </div>
          </div>

          <div className="bg-white border border-[#E2E9D1] rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">
              GraphQL API
            </h2>

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">
                  Endpoint:
                </span>{" "}
                POST /graphql
              </p>

              <p>
                <span className="font-semibold">
                  Response Time:
                </span>{" "}
                {graphqlTime} ms
              </p>

              <p>
                <span className="font-semibold">
                  Payload Size:
                </span>{" "}
                {graphqlPayload} bytes
              </p>

              <p>
                <span className="font-semibold">
                  Total Books:
                </span>{" "}
                {graphqlBooks?.length || 0}
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl mt-6 text-sm overflow-auto">
              <pre>
                {JSON.stringify(
                  graphqlBooks?.[0] || {},
                  null,
                  2
                )}
              </pre>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}