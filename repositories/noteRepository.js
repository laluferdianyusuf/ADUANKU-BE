const { notes } = require("../models");

class NoteRepository {
  static async createNote({ officerName, description, complaintId }) {
    const createdNote = await notes.create({
      officerName: officerName,
      description: description,
      complaintId: complaintId,
    });
    return createdNote;
  }

  static async getNoteById({ id }) {
    const getNote = await notes.findOne({ where: { id: id } });
    return getNote;
  }

  static async deleteNoteById({ id }) {
    const deletedNote = await notes.destroy({ where: { id: id } });
    return deletedNote;
  }

  static async getAllNoteByComplaintId({ complaintId }) {
    const getNote = await notes.findAll({
      where: { complaintId: complaintId },
    });
    return getNote;
  }
}

module.exports = NoteRepository;
