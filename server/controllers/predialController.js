const predialService = require("../services/predialService");
const { generateReceipt } = require("../utils/reports");

const getPredialById = async (req, res, next) => {
  try {
    const { db } = req.tenant;
    const { id } = req.params;
    const predial = await predialService.findPredialById(db, id);

    if (!predial) {
      res.status(404);
      throw new Error(`Can't find predial ${id}`);
    }

    res.set('Content-Type', 'application/json');
    res.status(200).json(predial);
  } catch (error) {
    next(error);
  }
};

const getPublicPredialById = async (req, res, next) => {
  try {
    const { db } = req.tenant;
    const { id } = req.params;
    const predial = await predialService.findPredialById(db, id);

    if (!predial) {
      res.status(404);
      throw new Error(`No se encontró un registro con el número de ficha </br> ${id}`);
    }

    const template = `
      <table class="predial-table">
        <tr class="predial-table__headers">
          <th>Propietario</th>
          <th>Ficha Catastral</th>
          <th>Matrícula</th>
          <th>Dirección</th>
          <th>Debe Desde</th>
          <th>Recibo Predial</th>
        </tr>
        <tr class="predial-table__data">
          <td> ${predial.propietario[0]} </td>
          <td> ${predial.ficha[0]} </td>
          <td> ${predial.matricula[0]} </td>
          <td> ${predial.direccion1[0]} </td>
          <td> ${predial.debeDesde[0]} </td>
          <td>
            <div class="predial-table__download">
              <a
                id="predialDownload"
                href="/api/predial/public/receipt/${predial.ficha[0]}" 
                data-ficha="${predial.ficha[0]}">
                <img src="images/pdf.png" alt="Generar PDF" />
              </a>
            </div>
          </td>
        </tr>
      </table>`;

    res.set('Content-Type', 'text/html');
    res.status(200).send(template);
  } catch (error) {
    next(error);
  }
};

const getPredialReceipt = async (req, res, next) => {
  try {
    const { db, configPath } = req.tenant;
    const { id } = req.params;
    const predial = await predialService.findPredialById(db, id);

    if (!predial) {
      res.status(404);
      throw new Error(`No se encontró un registro con el número de ficha </br> ${id}`);
    }

    const report = await generateReceipt(predial, configPath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=predial.pdf');
    res.status(200).end(report);
  } catch (error) {
    next(error);
  };
};

module.exports = {
  getPredialById,
  getPublicPredialById,
  getPredialReceipt
};
