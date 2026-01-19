
let submitted = false;

function checkFormComplete() {
  const state = document.getElementById("stateSelect")?.value ?? "";
  const company = document.getElementById("companySelect")?.value ?? "";
  const claimNumber = (document.getElementById("claimNumber")?.value || "").trim();
  document.getElementById("submitBtn").disabled = !(state && company && claimNumber);
}

async function submitSelections() {
  if (submitted) return;

  const state = document.getElementById("stateSelect").value;
  const company = document.getElementById("companySelect").value;
  const claimNumber = document.getElementById("claimNumber").value.trim();
  if (!state || !company || !claimNumber) return;

  submitted = true;

  try {
    // ✅ Use jsDelivr ESM endpoint with a pinned version
    const { Desktop } = await import(
      "https://cdn.jsdelivr.net/npm/@wxcc-desktop/sdk@2.0.11/+esm"
    );

    async function getInteractionId() {
      const taskMap = await Desktop.actions.getTaskMap();
      for (const t of taskMap) return t[1].interactionId;
      return null;
    }

    async function updateGlobalVariables(s, c, cn) {
      const interactionId = await getInteractionId();
      if (!interactionId) {
        console.error("No active interaction found");
        return;
      }
      await Desktop.dialer.updateCadVariables({
        interactionId,
        data: { attributes: { PVState: s, PVCarrier: c, PVClaimNumber: cn } }
      });
      console.log("Global variables updated successfully");
    }

    await updateGlobalVariables(state, company, claimNumber);
  } catch (e) {
    console.error("SDK import or CAD update failed:", e);
  }

  const appDiv = document.getElementById("app");
  appDiv.innerHTML = `
    <h3>Selected Values (sent to Flow)</h3>
    <p><strong>State:</strong> ${state}</p>
    <p><strong>Company:</strong> ${company}</p>
    <p><strong>Claim Number:</strong> ${claimNumber}</p>
    <p style="color:green;"><b>✔ Flow Variables Update Initiated</b></p>
  `;
}

// Wire events safely
function wireEvents() {
  const s = document.getElementById("stateSelect");
  const c = document.getElementById("companySelect");
  const n = document.getElementById("claimNumber");
  const b = document.getElementById("submitBtn");

  if (!s || !c || !n || !b) {
    setTimeout(wireEvents, 50);
    return;
  }
  s.addEventListener("change", checkFormComplete);
  c.addEventListener("change", checkFormComplete);
  n.addEventListener("input", checkFormComplete);
  b.addEventListener("click", submitSelections);

  checkFormComplete();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", wireEvents);
} else {
  wireEvents();
}
