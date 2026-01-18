// Default values
const DEFAULT_STATE = "IL";
const DEFAULT_CARRIER = "Statefarm";

// Read query parameters
const params = new URLSearchParams(window.location.search);
const state = params.get("state") || DEFAULT_STATE;
const carrier = params.get("carrier") || DEFAULT_CARRIER;

// Display selected values
const appDiv = document.getElementById("app");
if (appDiv) {
  appDiv.innerHTML = `
    <h2>Selected Values</h2>
    <p><strong>State:</strong> ${state}</p>
    <p><strong>Carrier:</strong> ${carrier}</p>
  `;
}

