import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  const validId = /^\d+$/.test(id);

  useEffect(() => {
    if (!validId) return;

    const controller = new AbortController();

    async function getProduct() {
      setLoading(true);
      setNotFound(false);
      setError("");

      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`, {
          signal: controller.signal,
        });

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Could not load course");
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError("Could not load course. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getProduct();

    return () => controller.abort();
  }, [id, validId]);

  if (!validId) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
        <Link to="/" className="text-blue-600 underline">
          Back to Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return <p className="p-6">Loading course...</p>;
  }

  if (notFound || !product) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <Link to="/products" className="text-blue-600 underline">
          Back to courses
        </Link>
      </div>
    );
  }

  function handleEnrol() {
    if (!user) {
      navigate("/login", {
        state: {
          from: {
            pathname: `/products/${id}`,
          },
        },
      });

      return;
    }

    const storageKey = `enrolledCourses_${user.id}`;

    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");

      if (!saved.includes(product.id)) {
        localStorage.setItem(
          storageKey,
          JSON.stringify([...saved, product.id]),
        );
      }

      navigate("/dashboard");
    } catch {
      alert("Could not save your enrolment. Please try again.");
    }
  }

  return (
    <div className="max-w-2xl p-6">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="mb-4 h-64 w-full object-cover"
      />

      <h1 className="text-3xl font-bold">{product.title}</h1>

      <p className="my-3">{product.description}</p>

      <p className="mb-4 font-bold">${product.price}</p>

      {error && <p className="mb-3 text-red-600">{error}</p>}

      <button
        onClick={handleEnrol}
        className="rounded bg-blue-600 px-5 py-2 text-white"
      >
        Enrol
      </button>
    </div>
  );
}
