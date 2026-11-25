import { useState, useEffect } from "react";

function useDebounce(value, delay) {
  const [deValue, setDevalue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDevalue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);
  return deValue;
}

export default useDebounce;
