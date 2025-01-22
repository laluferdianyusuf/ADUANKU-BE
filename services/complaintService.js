const { ROLES } = require("../lib/const");
const AbuserRepository = require("../repositories/abuserRepository");
const ComplaintRepository = require("../repositories/complaintRepository");
const UserRepository = require("../repositories/userRepository");
const VictimRepository = require("../repositories/victimRepository");
const nodeMailer = require("nodemailer");

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
    chronology,
    abusers,
  }) {
    try {
      const sendEmail = await UserRepository.getUsersByRoles({
        role: [ROLES.ADMIN, ROLES.SUPERADMIN],
      });

      const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: "appcom2024@gmail.com",
          pass: "tybi qjhx mwlu aroq",
        },
      });

      if (caseViolence == "fisik" && !physical) {
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
      if (caseViolence == "psikologi" && !psychology) {
        return {
          status: false,
          status_code: 400,
          message: "is required",
          data: { complaint: null },
        };
      }
      if (caseViolence == "ekonomi" && !economy) {
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
        const emailAddresses = sendEmail.forEach((user) => user.email);

        const mailOption = {
          from: "appcom2024@gmail.com",
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

        await transporter.sendMail(mailOption);

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
            status: "case is done",
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
      console.log(getUserById.role);

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

  static async getAllComplaints() {
    try {
      const getComplaints = await ComplaintRepository.getComplaints();
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
          status: "complaint is process",
        });
      } else {
        result = await ComplaintRepository.getComplaintByStatusAndUser({
          status: "complaint is process",
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
      const getComplaints = await ComplaintRepository.getComplaints();

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
