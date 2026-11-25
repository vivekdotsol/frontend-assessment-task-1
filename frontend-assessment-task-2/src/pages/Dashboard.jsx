import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function getCourses() {
      setLoading(true);
      setError("");

      try {
        const storageKey = `enrolledCourses_${user.id}`;
        const ids = JSON.parse(localStorage.getItem(storageKey) || "[]");

        const results = await Promise.all(
          ids.map(async (id) => {
            const response = await fetch(
              `https://dummyjson.com/products/${id}`,
              { signal: controller.signal },
            );

            if (!response.ok) return null;

            return response.json();
          }),
        );

        if (!controller.signal.aborted) {
          setCourses(results.filter(Boolean));
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Could not load your courses.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getCourses();

    return () => controller.abort();
  }, [user.id]);

  if (loading) {
    return <p className="p-6">Loading your courses...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-3xl font-bold">My Dashboard</h1>

      {error && <p className="text-red-600">{error}</p>}

      {!error && courses.length === 0 && (
        <p>
          You have not enrolled in any courses yet.{" "}
          <Link to="/products" className="text-blue-600 underline">
            Browse courses
          </Link>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="rounded border p-4">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="mb-3 h-36 w-full object-cover"
            />

            <h2 className="font-bold">{course.title}</h2>

            <Link
              to={`/products/${course.id}`}
              className="text-blue-600 underline"
            >
              View course
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
