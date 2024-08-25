const InformationService = require("../services/informationService");

const createInformation = async (req, res) => {
  const { title, descriptions } = req.body;

  const { status, status_code, message, data } =
    await InformationService.createInformation({
      title: title,
      descriptions: descriptions,
    });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const deleteInformation = async (req, res, next) => {
  const { id } = req.params;

  const { status, status_code, message, data } =
    await InformationService.deleteInformation({ id: id });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getAllInformation = async (req, res) => {
  const { status, status_code, message, data } =
    await InformationService.getAllInformation();

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

module.exports = { createInformation, deleteInformation, getAllInformation };
