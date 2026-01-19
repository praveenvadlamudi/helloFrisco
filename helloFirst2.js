import { Desktop } from "https://unpkg.com/@wxcc-desktop/sdk/dist/index.mjs";

let submitted = false;

function checkFormComplete() {
  const state = document.getElementById("stateSelect").value;
  const company = document.getElementById("companySelect").value;
  const claimNumber = document.getElementById("claimNumber").value.trim();
  document.getElementById("submitBtn").disabled = !(state && company && claimNumber);
}

async function getInteractionId() {
  const taskMap = await Desktop.actions.getTaskMap();
  for (const t of taskMap) {
    return t[1].interactionId;
  }
  return null;
}

async function updateGlobalVariables(state, company, claimNumber) {
  const interactionId = await getInteractionId();
  if (!interactionId) {
    console.error("No active interaction found");
    return;
  }
  await Desktop.dialer.updateCadVariables({
    interactionId,
    data: {
      attributes: {
        PVState: state,
        PVCarrier: company,
        PVClaimNumber: claimNumber
      }
    }
  });
}

async function submitSelections() {
  if (submitted) return;
  const state = document.getElementById("stateSelect").value;
  const company = document.getElementById("companySelect").value;
  const claimNumber = document.getElementById("claimNumber").value.trim();
  if (!state || !company || !claimNumber) return;
  submitted = true;

  await updateGlobalVariables(state, company, claimNumber);

  const appDiv = document.getElementById("app");
  appDiv.innerHTML = `
    <h3>Selected Values (sent to Flow)</h3>
    <p><strong>State:</strong> ${state}</p>
    <p><strong>Company:</strong> ${company}</p>
    <p><strong>Claim Number:</strong> ${claimNumber}</p>
    <p style="color:green;"><b>✔ Flow Variables Updated</b></p>
  `;
}

// Wire events when DOM is ready (module at end of body is fine)
document.getElementById("stateSelect").addEventListener("change", checkFormComplete);
document.getElementById("companySelect").addEventListener("change", checkFormComplete);
document.getElementById("claimNumber").addEventListener("input", checkFormComplete);
document.getElementById("submitBtn").addEventListener("click", submitSelections);
