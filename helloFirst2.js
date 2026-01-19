
// Import Webex Desktop SDK
import { Desktop } from "https://unpkg.com/@wxcc-desktop/sdk/dist/index.mjs";

let submitted = false;

// Enable button only when all fields have values
export function checkFormComplete() {
  const state = document.getElementById("stateSelect").value;
  const company = document.getElementById("companySelect").value;
  const claimNumber = document.getElementById("claimNumber").value.trim();

  document.getElementById("submitBtn").disabled = !(state && company && claimNumber);
}

// ---- Key Part: Get Interaction ID ----
async function getInteractionId() {
  const taskMap = await Desktop.actions.getTaskMap();
  for (const t of taskMap) {
    return t[1].interactionId;
  }
  return null;
}

// ---- Key Part: Update Flow Variables ----
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

  console.log("Global variables updated successfully");
}

// ---- Main Submit Handler ----
export async function submitSelections() {
  if (submitted) return;

  const state = document.getElementById("stateSelect").value;
  const company = document.getElementById("companySelect").value;
  const claimNumber = document.getElementById("claimNumber").value.trim();

  // Defensive check
  if (!state || !company || !claimNumber) return;

  submitted = true;

  // Write values into Global CAD variables in the Flow
  await updateGlobalVariables(state, company, claimNumber);

  // Replace widget contents
  const appDiv = document.getElementById("app");
  appDiv.innerHTML = `
    <h3>Selected Values (sent to Flow)</h3>
    <p><strong>State:</strong> ${state}</p>
    <p><strong>Company:</strong> ${company}</p>
    <p><strong>Claim Number:</strong> ${claimNumber}</p>
    <p style="color:green;"><b>✔ Flow Variables Updated</b></p>
  `;
}
