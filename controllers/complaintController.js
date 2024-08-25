const ComplaintService = require("../services/complaintService");

const createComplaint = async (req, res) => {
  const { id } = req.params;
  const {
    complaintName,
    complaintAddress,
    complaintEducate,
    complaintNumber,
    complaintRelation,
    companionName,
    companionAddress,
    companionEducate,
    companionNumber,
    companionRelation,
    victims,
    caseType,
    caseViolence,
    physical,
    sexual,
    psychology,
    economy,
    chronology,
    abusers,
  } = req.body;

  const { status, status_code, message, data } =
    await ComplaintService.createComplaint({
      userId: id,
      complaintName,
      complaintAddress,
      complaintEducate,
      complaintNumber,
      complaintRelation,
      companionName,
      companionAddress,
      companionEducate,
      companionNumber,
      companionRelation,
      victims,
      caseType,
      caseViolence,
      physical,
      sexual,
      psychology,
      economy,
      chronology,
      abusers,
    });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const updateComplaintIsProcess = async (req, res) => {
  const { id } = req.params;

  const { status, status_code, message, data } =
    await ComplaintService.updateComplaintIsProcess({ id: id });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const updateComplaintIsDone = async (req, res) => {
  const { id } = req.params;

  const { status, status_code, message, data } =
    await ComplaintService.updateComplaintIsDone({ id: id });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const deleteComplaint = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.users.id;

  const { status, status_code, message, data } =
    await ComplaintService.deleteComplaintById({ id: id, userId: userId });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getAllComplaints = async (req, res) => {
  const { status, status_code, message, data } =
    await ComplaintService.getAllComplaints();

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getComplaintIsWaiting = async (req, res) => {
  const { id } = req.users;

  const { status, status_code, message, data } =
    await ComplaintService.getComplaintIsWaiting({ id: id });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getComplaintIsProcess = async (req, res) => {
  const { id } = req.users;

  const { status, status_code, message, data } =
    await ComplaintService.getComplaintIsProcess({ id: id });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getComplaintIsDone = async (req, res) => {
  const { id } = req.users;

  const { status, status_code, message, data } =
    await ComplaintService.getComplaintIsDone({ id: id });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getComplaintByViolence = async (req, res, next) => {
  const { status, status_code, message, data } =
    await ComplaintService.getComplaintByViolence();

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getComplaintById = async (req, res, next) => {
  const { id } = req.params;

  const { status, status_code, message, data } =
    await ComplaintService.getComplaintById({ id: id });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const updateIsOpened = async (req, res) => {
  const { id } = req.params;

  const { status, status_code, message, data } =
    await ComplaintService.updateIsOpened({ id });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

module.exports = {
  createComplaint,
  updateComplaintIsProcess,
  updateComplaintIsDone,
  deleteComplaint,
  getAllComplaints,
  getComplaintById,
  getComplaintByViolence,
  getComplaintIsDone,
  getComplaintIsProcess,
  getComplaintIsWaiting,
  updateIsOpened,
};
