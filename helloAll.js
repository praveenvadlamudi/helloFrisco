// ---- App State ----
let submitted = false;

// ---- Create Root Container ----
const app = document.createElement("div");
app.id = "hello-app";
document.body.appendChild(app);

// ---- Render Initial UI ----
renderSelectionUI();

// ---- Functions ----

function renderSelectionUI() {
  app.innerHTML = `
    <h3>Select values</h3>

    <label>
      State:
      <select id="stateSelect">
        <option value="" disabled selected hidden></option>
        <option value="IL">IL</option>
        <option value="AZ">AZ</option>
      </select>
    </label>

    <br><br>

    <label>
      Company:
      <select id="companySelect">
        <option value="" disabled selected hidden></option>
        <option value="StateFarm">StateFarm</option>
        <option value="Geico">Geico</option>
      </select>
    </label>

    <br><br>

    <label>
      Claim Number:
      <input type="text" id="claimNumber" placeholder="Enter claim number" />
    </label>

    <br><br>

    <button id="submitBtn" disabled>Submit</button>
  `;

  wireEvents();
}

function wireEvents() {
  const stateSelect = document.getElementById("stateSelect");
  const companySelect = document.getElementById("companySelect");
  const claimInput = document.getElementById("claimNumber");
  const submitBtn = document.getElementById("submitBtn");

  const checkFormComplete = () => {
    submitBtn.disabled = !(
      stateSelect.value &&
      companySelect.value &&
      claimInput.value.trim()
    );
  };

  stateSelect.addEventListener("change", checkFormComplete);
  companySelect.addEventListener("change", checkFormComplete);
  claimInput.addEventListener("input", checkFormComplete);

  submitBtn.addEventListener("click", () => submitSelections(
    stateSelect.value,
    companySelect.value,
    claimInput.value.trim()
  ));
}

function submitSelections(state, company, claimNumber) {
  if (submitted) return;

  submitted = true;

  app.innerHTML = `
    <h3>Selected Values</h3>
    <p><strong>State:</strong> ${state}</p>
    <p><strong>Company:</strong> ${company}</p>
    <p><strong>Claim Number:</strong> ${claimNumber}</p>
  `;
}
