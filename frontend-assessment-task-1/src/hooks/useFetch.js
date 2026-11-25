import { useState, useEffect } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function getData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Status: " + response.status);
        }

        const result = await response.json();

        if (active) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (err.name !== "AbortError" && active) {
          setError(err);
          setLoading(false);
        }
      }
    }

    getData();

    return () => {
      active = false;
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
