import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-4xl font-bold">404</h1>

      <p className="my-3">Page not found.</p>

      <Link to="/" className="text-blue-600 underline">
        Back to Home
      </Link>
    </div>
  );
}
