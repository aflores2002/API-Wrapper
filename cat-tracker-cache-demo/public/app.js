async function fetchTokens() {
  try {
    const response = await fetch("/api/tokens");
    const data = await response.json();
    displayTokens(data.data.tokens);
  } catch (error) {
    console.error("Error fetching tokens:", error);
  }
}

function displayTokens(tokens) {
  const tokensList = document.getElementById("tokens-list");
  tokensList.innerHTML = tokens
    .map(
      (token) => `
          <div>
            <h2>${token.name}</h2>
            <p>Symbol: ${token.symbol}</p>
            <p>Token ID: ${token.tokenId}</p>
          </div>
        `
    )
    .join("");
}

fetchTokens();
