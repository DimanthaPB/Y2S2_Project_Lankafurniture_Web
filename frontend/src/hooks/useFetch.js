import { useEffect, useState } from "react";

/**
 * Simple reusable fetch hook.
 * @param {Function} fetcher - function returning a promise
 * @param {Array} deps - dependencies to trigger re-fetch
 */
export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    setData(null);
    setErr(null);

    fetcher()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setErr(e));

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, err };
}
