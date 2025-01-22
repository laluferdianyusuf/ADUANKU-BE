const { ROLES } = require("../lib/const");
const AbuserRepository = require("../repositories/abuserRepository");
const ComplaintRepository = require("../repositories/complaintRepository");
const UserRepository = require("../repositories/userRepository");
const VictimRepository = require("../repositories/victimRepository");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "transformasi-perempuan.com",
  port: 465,
  secure: true,
  auth: {
    user: "aduanku@transformasi-perempuan.com",
    pass: "BHB4ajug(JI6",
  },
});
class ComplaintService {
  static async createComplaint({
    userId,
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
    others,
    chronology,
    abusers,
  }) {
    try {
      const sendEmail = await UserRepository.getUsersByRoles({
        role: [ROLES.ADMIN, ROLES.SUPERADMIN],
      });

      if (caseViolence == "physical" && !physical) {
        return {
          status: false,
          status_code: 400,
          message: "is required",
          data: { complaint: null },
        };
      }
      if (caseViolence == "sexual" && !sexual) {
        return {
          status: false,
          status_code: 400,
          message: "is required",
          data: { complaint: null },
        };
      }
      if (caseViolence == "psychology" && !psychology) {
        return {
          status: false,
          status_code: 400,
          message: "is required",
          data: { complaint: null },
        };
      }
      if (caseViolence == "economy" && !economy) {
        return {
          status: false,
          status_code: 400,
          message: "is required",
          data: { complaint: null },
        };
      }
      if (caseViolence == "others" && !others) {
        return {
          status: false,
          status_code: 400,
          message: "is required",
          data: { complaint: null },
        };
      }

      const createComplaint = await ComplaintRepository.createComplaint({
        userId,
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
        caseType,
        caseViolence,
        physical,
        sexual,
        psychology,
        economy,
        others,
        chronology,
        status: "complaint is waiting",
        isOpened: false,
      });

      if (!createComplaint) {
        return {
          status: false,
          status_code: 403,
          message: "Cannot create a complaint",
          data: { complaint: null },
        };
      } else {
        const emailAddresses = sendEmail.map((user) => user.email);

        const mailOptions = {
          from: "aduanku@transformasi-perempuan.com",
          to: emailAddresses,
          subject:
            "Laporan Pengaduan dari Mitra : " + createComplaint.complaintName,
          html:
            "<p>Silahkan lihat lengkap laporan pengaduan " +
            createComplaint.complaintName +
            ' <a href="https://play.google.com/store/apps/details?id=com.tokopedia.tkpd' +
            '">Link</a> Masuk ke aplikasi</p>',
        };

        for (const vic of victims) {
          await VictimRepository.createVictim({
            ...vic,
            complaintId: createComplaint.id,
          });
        }

        for (const abuse of abusers) {
          await AbuserRepository.createAbuser({
            ...abuse,
            complaintId: createComplaint.id,
          });
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("Error occurred:", error.message);
          } else {
            console.log("Email sent:", info.response);
          }
        });

        return {
          status: true,
          status_code: 201,
          message: "successfully created",
          data: { complaint: createComplaint },
        };
      }
    } catch (error) {
      console.log(error);

      return {
        status: false,
        status_code: 500,
        message: "Error creating" + error,
        data: { complaint: null },
      };
    }
  }

  static async updateComplaintIsProcess({ id }) {
    try {
      const getComplaint = await ComplaintRepository.getComplaintById({
        id: id,
      });

      if (!getComplaint) {
        return {
          status: false,
          status_code: 404,
          message: "Complaint not found",
          data: {
            complaint: null,
          },
        };
      } else {
        const updateComplaint = await ComplaintRepository.updateComplaintStatus(
          {
            id: id,
            status: "complaint is processing",
          }
        );
        return {
          status: true,
          status_code: 200,
          message: "Complaint updated successfully",
          data: {
            complaint: updateComplaint,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { complaint: null },
      };
    }
  }

  static async updateComplaintIsDone({ id }) {
    try {
      const getComplaint = await ComplaintRepository.getComplaintById({
        id: id,
      });

      if (!getComplaint) {
        return {
          status: false,
          status_code: 404,
          message: "Complaint not found",
          data: {
            complaint: null,
          },
        };
      } else {
        const updateComplaint = await ComplaintRepository.updateComplaintStatus(
          {
            id: id,
            status: "complaint is done",
          }
        );
        return {
          status: true,
          status_code: 200,
          message: "Complaint updated successfully",
          data: {
            complaint: updateComplaint,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { complaint: null },
      };
    }
  }

  static async deleteComplaintById({ id, userId }) {
    try {
      const getUserById = await UserRepository.findUserById({
        id: userId,
      });

      if (getUserById.role !== "superadmin" && getUserById.role !== "admin") {
        const getComplaint = await ComplaintRepository.getComplaintByIdAndUser({
          id,
          userId,
        });

        if (!getComplaint) {
          return {
            status: false,
            status_code: 404,
            message: `Complaint with id ${id} and user id ${userId} is not found`,
            data: {
              complaint: null,
            },
          };
        }
      }

      await VictimRepository.deleteVictim({ complaintId: id });
      await AbuserRepository.deleteAbuser({ complaintId: id });

      const deleteComplaint =
        getUserById.role === "superadmin" || getUserById.role === "admin"
          ? await ComplaintRepository.deleteComplaintByAdmin({ id })
          : await ComplaintRepository.deleteComplaintById({ id, userId });

      return {
        status: true,
        status_code: 201,
        message: "deleted successfully",
        data: {
          complaint: deleteComplaint,
        },
      };
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { complaint: null },
      };
    }
  }

  static async getAllComplaints({ id }) {
    try {
      const getComplaints = await ComplaintRepository.getComplaints({ id: id });
      if (!getComplaints) {
        return {
          status: false,
          status_code: 404,
          message: "Complaint not found",
          data: {
            complaint: null,
          },
        };
      } else {
        return {
          status: true,
          status_code: 200,
          message: "Success get request",
          data: { complaint: getComplaints },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { complaint: null },
      };
    }
  }
  static async getAllComplaintsByAdmin() {
    try {
      const getComplaints = await ComplaintRepository.getComplaintsByAdmin();

      if (!getComplaints) {
        return {
          status: false,
          status_code: 404,
          message: "Complaint not found",
          data: {
            complaint: null,
          },
        };
      } else {
        return {
          status: true,
          status_code: 200,
          message: "Success get request",
          data: { complaint: getComplaints },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { complaint: null },
      };
    }
  }

  static async getComplaintIsWaiting({ id }) {
    try {
      const getUser = await UserRepository.findUserById({ id: id });

      if (!getUser) {
        return {
          status: false,
          status_code: 404,
          message: "user not found",
          data: { complaint: null },
        };
      }

      const userRole = getUser.role;

      let result;

      if (userRole === ROLES.ADMIN || userRole === ROLES.SUPERADMIN) {
        result = await ComplaintRepository.getComplaintByStatus({
          status: "complaint is waiting",
        });
      } else {
        result = await ComplaintRepository.getComplaintByStatusAndUser({
          status: "complaint is waiting",
          userId: id,
        });
      }

      if (!result) {
        return {
          status: false,
          status_code: 404,
          message: "Complaint not found",
          data: { complaint: null },
        };
      } else {
        return {
          status: true,
          status_code: 200,
          message: "Complaint found",
          data: { complaint: result },
        };
      }
    } catch (error) {
      console.log(error);

      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { complaint: null },
      };
    }
  }

  static async getComplaintIsProcess({ id }) {
    try {
      const getUser = await UserRepository.findUserById({ id: id });

      if (!getUser) {
        return {
          status: false,
          status_code: 404,
          message: "user not found",
          data: { complaint: null },
        };
      }

      const userRole = getUser.role;

      let result;

      if (userRole === ROLES.ADMIN || userRole === ROLES.SUPERADMIN) {
        result = await ComplaintRepository.getComplaintByStatus({
          status: "complaint is processing",
        });
      } else {
        result = await ComplaintRepository.getComplaintByStatusAndUser({
          status: "complaint is processing",
          userId: id,
        });
      }

      if (!result) {
        return {
          status: false,
          status_code: 404,
          message: "Complaint not found",
          data: { complaint: null },
        };
      } else {
        return {
          status: true,
          status_code: 200,
          message: "Complaint found",
          data: { complaint: result },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { complaint: null },
      };
    }
  }

  static async getComplaintIsDone({ id }) {
    try {
      const getUser = await UserRepository.findUserById({ id: id });

      if (!getUser) {
        return {
          status: false,
          status_code: 404,
          message: "user not found",
          data: { complaint: null },
        };
      }

      const userRole = getUser.role;

      let result;

      if (userRole === ROLES.ADMIN || userRole === ROLES.SUPERADMIN) {
        result = await ComplaintRepository.getComplaintByStatus({
          status: "complaint is done",
        });
      } else {
        result = await ComplaintRepository.getComplaintByStatusAndUser({
          status: "complaint is done",
          userId: id,
        });
      }

      if (!result) {
        return {
          status: false,
          status_code: 404,
          message: "Complaint not found",
          data: { complaint: null },
        };
      } else {
        return {
          status: true,
          status_code: 200,
          message: "Complaint found",
          data: { complaint: result },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { complaint: null },
      };
    }
  }

  static async getComplaintByViolence() {
    try {
      const getComplaints = await ComplaintRepository.getComplaintsByAdmin();

      const violenceCount = [
        { type: "physical", count: 0 },
        { type: "sexual", count: 0 },
        { type: "psychology", count: 0 },
        { type: "economy", count: 0 },
      ];

      getComplaints.forEach((item) => {
        if (Array.isArray(item.caseViolence)) {
          item.caseViolence.forEach((type) => {
            const violence = violenceCount.find((v) => v.type === type);
            if (violence) {
              violence.count++;
            }
          });
        }
      });

      if (!getComplaints) {
        return {
          status: false,
          status_code: 404,
          message: "Not Found",
          data: { complaint: null },
        };
      } else {
        return {
          status: true,
          status_code: 200,
          message: "complaint founded",
          data: { complaint: violenceCount },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { complaint: null },
      };
    }
  }

  static async getComplaintById({ id }) {
    try {
      const getComplaint = await ComplaintRepository.getComplaintById({
        id: id,
      });
      if (!getComplaint) {
        return {
          status: false,
          status_code: 404,
          message: "Complaint not found",
          data: {
            complaint: null,
          },
        };
      } else {
        return {
          status: true,
          status_code: 200,
          message: "Complaint founded",
          data: {
            complaint: getComplaint,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { complaint: null },
      };
    }
  }

  static async updateIsOpened({ id }) {
    try {
      const getComplaint = await ComplaintRepository.getComplaintById({
        id: id,
      });

      if (!getComplaint) {
        return {
          status: false,
          status_code: 404,
          message: "Complaint not found",
          data: { complaint: null },
        };
      } else {
        const updateIsOpened =
          await ComplaintRepository.updateComplaintIsOpened({
            id: id,
            isOpened: true,
          });
        return {
          status: true,
          status_code: 200,
          message: "Complaint is opened",
          data: {
            complaint: updateIsOpened,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "Error: " + error.message,
        data: {
          complaint: null,
        },
      };
    }
  }
}

module.exports = ComplaintService;
