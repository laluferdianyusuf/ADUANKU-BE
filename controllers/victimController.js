const VictimService = require("../services/victimService");

const getVictimByCount = async (req, res, next) => {
  const { status, status_code, message, data } =
    await VictimService.getVictimByCount();

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

module.exports = { getVictimByCount };
