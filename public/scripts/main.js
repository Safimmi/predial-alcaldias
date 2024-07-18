document.addEventListener('DOMContentLoaded', () => {
  const SPINNER = document.getElementById('spinner');
  const DATA_CONTAINER = document.getElementById("dataContainer");
  const PREDIAL_FORM = document.getElementById("predialForm");
  const PREDIAL_INPUT_CONTAINER = document.getElementById('predialInputContainer');
  const PREDIAL_INPUT = document.getElementById('predialInput');

  //* METHODS

  function init() {
    PREDIAL_INPUT.setCustomValidity("Ingrese un número de ficha");
  }

  function validatePredialId(input) {
    let validationMessage = "";

    if (input.validity.valueMissing) {
      validationMessage = "Ingrese un número de ficha";
    } else if (input.validity.patternMismatch) {
      validationMessage = "El número de ficha debe ser numérico";
    }

    PREDIAL_INPUT.setCustomValidity(validationMessage);
  }

  function clearData() {
    DATA_CONTAINER.innerHTML = "";
  }

  function toggleSpinner() {
    SPINNER.classList.toggle('spinner--hidden');
  }

  function displayError(error) {
    console.log(error);
    DATA_CONTAINER.innerHTML = `<p class="predial__error">Algo salió mal</p>`;
  }

  //* EVENTS

  PREDIAL_INPUT_CONTAINER.addEventListener('click', () => PREDIAL_INPUT.focus());
  PREDIAL_INPUT.addEventListener('input', e => validatePredialId(e.target));

  PREDIAL_FORM.addEventListener("submit", e => {
    e.preventDefault();
    clearData();
    toggleSpinner();

    const endpoint = e.target.getAttribute("action");
    const method = e.target.getAttribute("method");

    let predialNumber = PREDIAL_INPUT.value ? PREDIAL_INPUT.value.replace(/\s+/g, '') : "%20";
    const url = `${endpoint}/${predialNumber}`;

    fetch(url, {
      method,
      headers: {
        'Accept': 'text/html'
      }
    })
      .then(response => response.text())
      .then(predialData => DATA_CONTAINER.innerHTML = predialData)
      .catch(error => displayError(error))
      .finally(() => {
        toggleSpinner();
        PREDIAL_FORM.reset();
      });
  });

  //* INIT

  init();
});
