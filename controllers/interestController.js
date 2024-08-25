const InterestService = require("../services/interestService");

const createInterest = async (req, res) => {
  const { id } = req.params;
  const { lesson } = req.body;
  const userId = req.users.id;

  const { status, status_code, message, data } =
    await InterestService.createInterest({
      id: id,
      userId: userId,
      lesson: lesson,
    });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getAllInterest = async (req, res, next) => {
  const { status, status_code, message, data } =
    await InterestService.getAllInterest();

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getInterestByComplaintId = async (req, res, next) => {
  const { id } = req.params;
  const { status, status_code, message, data } =
    await InterestService.getInterestByComplaintId({ complaintId: id });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

module.exports = { createInterest, getAllInterest, getInterestByComplaintId };
