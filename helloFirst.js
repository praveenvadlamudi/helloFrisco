let submitted = false;

/**
 * Enable submit only when all inputs are filled
 */
function checkFormComplete() {
  const state = document.getElementById("stateSelect").value;
  const company = document.getElementById("companySelect").value;
  const claimNumber = document.getElementById("claimNumber").value.trim();

  document.getElementById("submitBtn").disabled =
    !(state && company && claimNumber);
}

/**
 * Submit selections and update WxCC CAD variables
 */
async function submitSelections() {
  if (submitted) return;

  const state = document.getElementById("stateSelect").value;
  const company = document.getElementById("companySelect").value;
  const claimNumber = document.getElementById("claimNumber").value.trim();

  if (!state || !company || !claimNumber) return;

  // ---- Webex Contact Center SDK ----
  const agentDesktop = window.wxcc.agentDesktop;

  if (!agentDesktop) {
    console.error("WxCC Agent Desktop SDK not available");
    return;
  }

  try {
    // Get active task (connected outbound call)
    const task = await agentDesktop.task.getCurrentTask();

    if (!task || !task.taskId) {
      console.error("No active task found");
      return;
    }

    // Update CAD variables
    await agentDesktop.task.updateCadVariables(task.taskId, {
      PVState: state,
      PVCarrier: company,
      PVClaimNumber: claimNumber
    });

    console.log("CAD variables updated successfully");

    submitted = true;

    // Replace UI with confirmation
    document.getElementById("app").innerHTML = `
      <h3>Selected Values</h3>
      <p><strong>State:</strong> ${state}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Claim Number:</strong> ${claimNumber}</p>
    `;

  } catch (error) {
    console.error("Failed to update CAD variables", error);
  }
}
