import useSWR from "swr";
import { API_URL, fetcher } from "../../api-wrapper.mjs";

export function useTokens(limit = 10000, offset = 0) {
  const { data, error } = useSWR(
    `${API_URL}/api/tokens?limit=${limit}&offset=${offset}&v=1`,
    fetcher
  );

  console.log("useTokens hook:", { data, error, API_URL });

  return {
    tokens: data?.data?.tokens,
    isLoading: !error && !data,
    isError: error,
  };
}
