const Predial = require("../models/predial");
const { generateReceipt } = require("../utils/reports");

//TODO: Use "ficha" as the ID on the DB so it can be indexed => Use .findById() instead of .findOne()

const getPredialById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = { ficha: { $in: [id] } };
    const predial = await Predial.findOne(query);

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
    const { id } = req.params;
    const query = { ficha: { $in: [id] } };
    const predial = await Predial.findOne(query);

    if (!predial) {
      res.status(404);
      throw new Error(`No se encontró un registro con el número de ficha </br> ${id}`);
    }

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
          <td> ${predial.fechaFactura[0]} </td>
          <td>
            <div class="predial-table__download">
              <img src="images/pdf.png" alt=recibo-pdf" />
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
    const { id } = req.params;
    const query = { ficha: { $in: [id] } };
    const predial = await Predial.findOne(query);

    if (!predial) {
      res.status(404);
      throw new Error(`No se encontró un registro con el número de ficha </br> ${id}`);
    }

    const report = await generateReceipt(predial);

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
