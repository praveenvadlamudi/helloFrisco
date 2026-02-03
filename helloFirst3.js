let submitted = false;

//Added logging
function checkFormComplete() {
  const state = document.getElementById("stateSelect")?.value ?? "";
  const company = document.getElementById("companySelect")?.value ?? "";
  const callType = document.getElementById("callType")?.value ?? "";
  const claimNumber = (document.getElementById("claimNumber")?.value || "").trim();
  document.getElementById("submitBtn").disabled = !(state && company && callType && claimNumber);
}

function ensureDiagnosticsArea() {
  let diag = document.getElementById("diagnostics");
  if (!diag) {
    diag = document.createElement("div");
    diag.id = "diagnostics";
    diag.style.cssText = "margin-top:12px;padding:8px;border:1px dashed #999;font-family:monospace;white-space:pre-wrap;";
    document.getElementById("app").appendChild(diag);
  }
  return diag;
}

function uiLog(message) {
  const diag = ensureDiagnosticsArea();
  const ts = new Date().toISOString();
  diag.textContent += `[${ts}] ${message}\n`;
}

async function submitSelections() {
  if (submitted) return;

  const state = document.getElementById("stateSelect").value;
  const company = document.getElementById("companySelect").value;
  const callType = document.getElementById("callType").value;
  const claimNumber = document.getElementById("claimNumber").value.trim();
  if (!state || !company || !callType || !claimNumber) return;

  submitted = true;

  // Show selected values immediately
  const appDiv = document.getElementById("app");
  appDiv.innerHTML = `
    <h3>Selected Values (sent to Flow)</h3>
    <p><strong>State:</strong> ${state}</p>
    <p><strong>Company:</strong> ${company}</p>
	<p><strong>Call Type:</strong> ${callType}</p>
    <p><strong>Afni Claim Number:</strong> ${claimNumber}</p>
    <p id="status" style="margin-top:8px;color:#005e7d;"><b>Update Status: starting…</b></p>
  `;

  try {
    // ✅ browser-ready ESM import
    const { Desktop } = await import(
      "https://cdn.jsdelivr.net/npm/@wxcc-desktop/sdk@2.0.11/+esm"
    );

    // Optional: initialize config (harmless if already initialized by desktop)
    await Desktop.config.init?.();

    // Show the entire task map
    const taskMap = await Desktop.actions.getTaskMap();
    uiLog(`taskMap size = ${taskMap?.size}`);
    for (const entry of taskMap) {
      uiLog(`taskMap entry: ${JSON.stringify(entry[1], null, 2)}`);
    }

    // Extract an interactionId (first task)
    let interactionId = null;
    for (const t of taskMap) {
      interactionId = t[1]?.interactionId;
      break;
    }
    uiLog(`interactionId chosen = ${interactionId}`);

    if (!interactionId) {
      document.getElementById("status").innerHTML =
        `<b style="color:#b00020">Update Status: no active interaction found</b>`;
      uiLog("No active interaction found. CAD update aborted.");
      return;
    }

    // Perform CAD update
    const payload = {
      interactionId,
      data: {
        attributes: {
          PVState: state,
          PVCarrier: company,
          PVClaimNumber: claimNumber
        }
      }
    };
    uiLog(`updateCadVariables payload: ${JSON.stringify(payload, null, 2)}`);

    const result = await Desktop.dialer.updateCadVariables(payload);
    uiLog(`updateCadVariables result: ${JSON.stringify(result, null, 2)}`);
    document.getElementById("status").innerHTML =
      `<b style="color:#00853c">Update Status: request sent successfully</b>`;
  } catch (e) {
    console.error(e);
    uiLog(`ERROR: ${e?.message || e}`);
    document.getElementById("status").innerHTML =
      `<b style="color:#b00020">Update Status: failed (${e?.message || e})</b>`;
  }
}

function wireEvents() {
  const s = document.getElementById("stateSelect");
  const c = document.getElementById("companySelect");
  const t = document.getElementById("callType");
  const n = document.getElementById("claimNumber");
  const b = document.getElementById("submitBtn");

  if (!s || !c || !t || !n || !b) {
    setTimeout(wireEvents, 50);
    return;
  }
  s.addEventListener("change", checkFormComplete);
  c.addEventListener("change", checkFormComplete);
  t.addEventListener("change", checkFormComplete);
  n.addEventListener("input", checkFormComplete);
  b.addEventListener("click", submitSelections);
  checkFormComplete();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", wireEvents);
} else {
  wireEvents();
}
