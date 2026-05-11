import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />

      <div className="min-h-screen p-10">
        <h1 className="text-4xl font-bold">
          Library System
        </h1>

        <p className="mt-4 text-gray-600">
          REST API vs GraphQL API Comparison
        </p>
      </div>
    </div>
  );
}