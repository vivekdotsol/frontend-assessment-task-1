import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="mb-3 text-3xl font-bold">Welcome to Course App</h1>

      <p className="mb-4">Discover courses and start learning.</p>

      <Link to="/products" className="text-blue-600 underline">
        Browse Courses
      </Link>
    </div>
  );
}
