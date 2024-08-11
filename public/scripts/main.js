class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ServerError';
  }
}

const ERROR_TYPES = Object.freeze({
  htmlContainer: "html-container",
  alertPopUp: "alert-pop-up"
});

document.addEventListener('DOMContentLoaded', () => {
  const SPINNER = document.getElementById('spinner');
  const DATA_CONTAINER = document.getElementById("dataContainer");
  const PREDIAL_FORM = document.getElementById("predialForm");
  const PREDIAL_INPUT_CONTAINER = document.getElementById('predialInputContainer');
  const PREDIAL_INPUT = document.getElementById('predialInput');

  let PREDIAL_DOWNLOAD_BUTTON = null;

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

  function displayError(error, type) {
    const { htmlContainer, alertPopUp } = ERROR_TYPES;
    const errorMessage = error instanceof ServerError ? error.message : "Algo salió mal";

    switch (type) {
      case htmlContainer:
        DATA_CONTAINER.innerHTML = `<p class="predial__error">${errorMessage}</p>`;
        break;
      case alertPopUp:
        alert(errorMessage);
        break;
      default:
        break;
    }
  }

  function downloadPredial(e) {
    e.preventDefault();

    const target = e.currentTarget;
    const url = target.href;
    const predialNumber = target.dataset.ficha;
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf, text/html',
      }
    })
      .then(response => {
        const contentType = response.headers.get('content-type');
        if (!response.ok || contentType.includes('text/html')) {
          return response.text().then(errorText => {
            throw new ServerError(errorText);
          });
        }
        return response.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${predialNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => displayError(error, ERROR_TYPES.alertPopUp));
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
      .then(response => {
        return response.text()
          .then(responseText => {
            if (!response.ok) {
              throw new ServerError(responseText);
            }
            return responseText;
          });
      })
      .then(predialData => DATA_CONTAINER.innerHTML = predialData)
      .then(() => {
        PREDIAL_DOWNLOAD_BUTTON = document.getElementById('predialDownload');
        if (PREDIAL_DOWNLOAD_BUTTON) {
          PREDIAL_DOWNLOAD_BUTTON.addEventListener('click', e => downloadPredial(e));
        }
      })
      .catch(error => displayError(error, ERROR_TYPES.htmlContainer))
      .finally(() => {
        toggleSpinner();
        PREDIAL_FORM.reset();
      });
  });

  //* INIT

  init();
});
