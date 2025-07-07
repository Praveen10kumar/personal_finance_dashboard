import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cb(...args);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, fetchData, setData };
};
export default useFetch;