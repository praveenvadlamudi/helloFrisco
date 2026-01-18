import { Desktop } from '@wxcc-desktop/sdk';

let submitted = false;

// Initialize Desktop SDK
Desktop.config.init();

// Enable submit only when all inputs are filled
function checkFormComplete() {
  const state = document.getElementById('stateSelect').value;
  const company = document.getElementById('companySelect').value;
  const claimNumber = document.getElementById('claimNumber').value.trim();

  document.getElementById('submitBtn').disabled =
    !(
		state !== "" &&
		company !== "" &&
		claimNumber.length > 0
	);
}

// Attach listeners
document.getElementById('stateSelect').addEventListener('change', checkFormComplete);
document.getElementById('companySelect').addEventListener('change', checkFormComplete);
document.getElementById('claimNumber').addEventListener('input', checkFormComplete);
document.getElementById('submitBtn').addEventListener('click', submitSelections);

// Main submit logic
async function submitSelections() {
  if (submitted) return;

  const state = document.getElementById('stateSelect').value;
  const company = document.getElementById('companySelect').value;
  const claimNumber = document.getElementById('claimNumber').value.trim();

  try {
    // Get current task map
    const taskMap = await Desktop.actions.getTaskMap();

    if (!taskMap || taskMap.size === 0) {
      console.error('No active task found');
      return;
    }

    // Get first active interaction
    const task = [...taskMap.values()][0];
    const interactionId = task.interactionId;

    // Update CAD / Flow Global Variables
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

    submitted = true;

    // Replace UI
    document.getElementById('app').innerHTML = `
      <h3>Selected Values</h3>
      <p><strong>State:</strong> ${state}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Claim Number:</strong> ${claimNumber}</p>
    `;

    console.log('CAD variables updated successfully');

  } catch (error) {
    console.error('Failed to update CAD variables', error);
  }
}
