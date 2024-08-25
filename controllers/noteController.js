const NoteService = require("../services/noteService");

const createNote = async (req, res, next) => {
  const { id } = req.params;
  const { officerName, description } = req.body;
  const { status, status_code, message, data } = await NoteService.createNote({
    id: id,
    officerName: officerName,
    description: description,
  });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const deleteNote = async (req, res, next) => {
  const { id } = req.params;

  const { status, status_code, message, data } =
    await NoteService.deleteNoteById({ id: id });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getAllNotesByComplaint = async (req, res, next) => {
  const { id } = req.params;

  const { status, status_code, message, data } =
    await NoteService.getAllNotesByComplaint({ id: id });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

module.exports = { createNote, deleteNote, getAllNotesByComplaint };
