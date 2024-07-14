document.addEventListener('DOMContentLoaded', () => {
  const SPINNER = document.getElementById('spinner');
  const DATA_CONTAINER = document.getElementById("dataContainer");
  const PREDIAL_FORM = document.getElementById("predialForm");
  const PREDIAL_INPUT_CONTAINER = document.getElementById('predialInputContainer');
  const PREDIAL_INPUT = document.getElementById('predialInput');

  function formatPredialNumberInput(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    let formattedValue = '';

    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value.charAt(i);
    }

    input.value = formattedValue;
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

  //* Events

  PREDIAL_INPUT_CONTAINER.addEventListener('click', () => PREDIAL_INPUT.focus());
  PREDIAL_INPUT.addEventListener('input', e => formatPredialNumberInput(e.target));

  PREDIAL_FORM.addEventListener("submit", e => {
    e.preventDefault();
    clearData();
    toggleSpinner();

    const endpoint = e.target.getAttribute("action");
    const method = e.target.getAttribute("method");
    const predialNumber = String(PREDIAL_INPUT.value).replace(/\s+/g, '');
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
});
