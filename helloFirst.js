let submitted = false;

function checkFormComplete() {
  const state = document.getElementById("stateSelect").value;
  const company = document.getElementById("companySelect").value;
  const claimNumber = document.getElementById("claimNumber").value.trim();

  const submitBtn = document.getElementById("submitBtn");

  // Enable submit only if all three have values
  submitBtn.disabled = !(state && company && claimNumber);
}

function submitSelections() {
  if (submitted) return;

  const state = document.getElementById("stateSelect").value;
  const company = document.getElementById("companySelect").value;
  const claimNumber = document.getElementById("claimNumber").value.trim();

  if (!state || !company || !claimNumber) {
    return;
  }

  submitted = true;

  const appDiv = document.getElementById("app");

  appDiv.innerHTML = `
    <h3>Selected Values</h3>
    <p><strong>State:</strong> ${state}</p>
    <p><strong>Company:</strong> ${company}</p>
    <p><strong>Claim Number:</strong> ${claimNumber}</p>
  `;
}
