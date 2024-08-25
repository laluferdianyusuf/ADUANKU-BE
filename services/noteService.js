const ComplaintRepository = require("../repositories/complaintRepository");
const NoteRepository = require("../repositories/noteRepository");

class NoteService {
  static async createNote({ id, officerName, description }) {
    try {
      if (!officerName) {
        return {
          status: false,
          status_code: 400,
          message: "Please enter your name",
          data: {
            note: null,
          },
        };
      }

      if (!description) {
        return {
          status: false,
          status_code: 400,
          message: "Please enter a description",
          data: {
            note: null,
          },
        };
      }

      const getComplaint = await ComplaintRepository.getComplaintById({
        id: id,
      });

      if (!getComplaint) {
        return {
          status: false,
          status_code: 404,
          message: "Complaint not found",
          data: {
            note: null,
          },
        };
      } else {
        const createNote = await NoteRepository.createNote({
          officerName: officerName,
          description: description,
          complaintId: getComplaint.id,
        });

        return {
          status: true,
          status_code: 201,
          message: "created successfully",
          data: {
            node: createNote,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { note: null },
      };
    }
  }

  static async deleteNoteById({ id }) {
    try {
      const getNote = await NoteRepository.getNoteById({ id: id });

      if (!getNote) {
        return {
          status: false,
          status_code: 404,
          message: "Note not found",
          data: {
            note: null,
          },
        };
      } else {
        const deleteNote = await NoteRepository.deleteNoteById({ id: id });
        return {
          status: true,
          status_code: 200,
          message: "Deleted note",
          data: {
            note: deleteNote,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { note: null },
      };
    }
  }

  static async getAllNotesByComplaint({ id }) {
    try {
      const getNotes = await NoteRepository.getAllNoteByComplaintId({
        complaintId: id,
      });
      if (!getNotes) {
        return {
          status: false,
          status_code: 404,
          message: "Note not found",
          data: {
            note: null,
          },
        };
      } else {
        return {
          status: true,
          status_code: 200,
          message: "Note founded",
          data: {
            note: getNotes,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { note: null },
      };
    }
  }
}

module.exports = NoteService;
