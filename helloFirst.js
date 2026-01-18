// State to track submission
let submitted = false;

function submitSelections() {
  if (submitted) return;

  const state = document.getElementById("stateSelect").value;
  const company = document.getElementById("companySelect").value;

  // Prevent submit if nothing selected
  if (!state || !company) {
    alert("Please select both values.");
    return;
  }

  submitted = true;

  const appDiv = document.getElementById("app");

  appDiv.innerHTML = `
    <h3>Selected Values</h3>
    <p><strong>State:</strong> ${state}</p>
    <p><strong>Company:</strong> ${company}</p>
  `;
}
