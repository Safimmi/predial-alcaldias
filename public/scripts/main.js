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

  function displayPredialData(predial) {
    const template = `
      <table class="predial-table">
        <tr class="predial-table__headers">
          <th>Ficha</th>
          <th>Matrícula</th>
          <th>Propietario</th>
          <th>Recibo</th>
          <th>Fecha de Facturación</th>
        </tr>
        <tr class="predial-table__data">
          <td> ${predial.ficha[0]} </td>
          <td> ${predial.matricula[0]} </td>
          <td> ${predial.propietario[0]} </td>
          <td> ${predial.fecha_facturacion[0]} </td>
          <td>
            <div class="predial-table__download">
              <img src="images/pdf.png" alt=recibo-pdf" />
            </div>
          </td>
        </tr>
      </table>`;
    DATA_CONTAINER.innerHTML = template;
  }

  function displayError(error) {
    const template = `<p class="predial__error"> ${error.message} </p>`;
    DATA_CONTAINER.innerHTML = template;
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
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status == 404) {
          throw new Error(`No se encontró un registro con el número de ficha </br> ${predialNumber}`);
        }
        return response.json();
      })
      .then(predialData => displayPredialData(predialData))
      .catch(error => displayError(error))
      .finally(() => {
        toggleSpinner();
        PREDIAL_FORM.reset();
      });
  });
});
