import { useTokens } from "../hooks/useTokens";

export default function Home() {
  const { tokens, isLoading, isError } = useTokens();

  console.log("Home component:", { tokens, isLoading, isError });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading tokens: {isError.message}</div>;

  return (
    <div>
      <h1>Tokens</h1>
      {tokens && tokens.length > 0 ? (
        tokens.map((token) => <div key={token.tokenId}>{token.name}</div>)
      ) : (
        <div>No tokens found</div>
      )}
    </div>
  );
}
