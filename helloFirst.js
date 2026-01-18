import { Desktop } from '@wxcc-desktop/sdk';

let submitted = false;

// Initialize Desktop SDK
Desktop.config.init();

// Enable submit only when all inputs are filled
function checkFormComplete() {
  const state = document.getElementById('stateSelect').value;
  const carrier = document.getElementById('carrierSelect').value;
  const claim = document.getElementById('claimNumber').value.trim();

  document.getElementById('submitBtn').disabled =
    !(state && carrier && claim);
}

// Attach listeners
document.getElementById('stateSelect').addEventListener('change', checkFormComplete);
document.getElementById('carrierSelect').addEventListener('change', checkFormComplete);
document.getElementById('claimNumber').addEventListener('input', checkFormComplete);
document.getElementById('submitBtn').addEventListener('click', submitSelections);


async function getActiveInteractionId() {
  const taskMap = await Desktop.actions.getTaskMap();
  if (!taskMap || taskMap.size === 0) return null;

  const task = [...taskMap.values()][0];
  return task.interactionId || null;
}


// Main submit logic
async function submitSelections() {
  if (submitted) return;

  const state = document.getElementById('stateSelect').value;
  const carrier = document.getElementById('carrierSelect').value;
  const claimNumber = document.getElementById('claimNumber').value.trim();

  try {
    // Get active interaction
	const interactionId = await getActiveInteractionId();
	if (!interactionId) {
	  console.warn('No active interaction');
	  return;
	}
    
    // Update CAD / Flow Global Variables
    await Desktop.dialer.updateCadVariables({
      interactionId,
      data: {
        attributes: {
          PVState: state,
          PVCarrier: carrier,
          PVClaimNumber: claimNumber
        }
      }
    });

    submitted = true;

    // Replace UI
    document.getElementById('app').innerHTML = `
      <h3>Selected Values</h3>
      <p><strong>State:</strong> ${state}</p>
      <p><strong>Carrier:</strong> ${carrier}</p>
      <p><strong>Claim Number:</strong> ${claimNumber}</p>
    `;

    console.log('CAD variables updated successfully');

  } catch (error) {
    console.error('Failed to update CAD variables', error);
  }
}
