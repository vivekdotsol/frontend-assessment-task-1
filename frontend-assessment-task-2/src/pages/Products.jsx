import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function getProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "https://dummyjson.com/products?limit=20",
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Could not load courses");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError("Could not load courses. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getProducts();

    return () => controller.abort();
  }, [retry]);

  if (loading) {
    return <p className="p-6">Loading courses...</p>;
  }

  if (error) {
    return (
      <div className="p-6">
        <p>{error}</p>

        <button
          onClick={() => setRetry((value) => value + 1)}
          className="mt-3 rounded bg-blue-600 px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-5 text-3xl font-bold">Courses</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="rounded border p-4 shadow">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="mb-3 h-40 w-full object-cover"
            />

            <h2 className="font-bold">{product.title}</h2>

            <p className="my-2">${product.price}</p>

            <Link
              to={`/products/${product.id}`}
              className="text-blue-600 underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
