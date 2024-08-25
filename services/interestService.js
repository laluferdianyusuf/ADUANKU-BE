const ComplaintRepository = require("../repositories/complaintRepository");
const InterestRepository = require("../repositories/interestRepository");
const UserRepository = require("../repositories/userRepository");

class InterestService {
  static async createInterest({ id, userId, lesson }) {
    try {
      const getComplaint = await ComplaintRepository.getComplaintById({ id });
      const getUser = await UserRepository.findUserById({ id: userId });

      if (!getUser) {
        return {
          status: false,
          status_code: 400,
          message: "user not found",
          data: {
            interest: null,
          },
        };
      }

      if (!lesson) {
        return {
          status: false,
          status_code: 400,
          message: "Lesson is required",
          data: {
            interest: null,
          },
        };
      }

      if (!getComplaint) {
        return {
          status: false,
          status_code: 404,
          message: "complaint not found",
          data: {
            interest: null,
          },
        };
      } else {
        const createInterest = await InterestRepository.createInterest({
          userId: getUser.id,
          lesson: lesson,
          complaintId: getComplaint.id,
        });

        return {
          status: true,
          status_code: 201,
          message: "Interests created successfully",
          data: {
            interest: createInterest,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { interest: null },
      };
    }
  }

  static async getAllInterest() {
    try {
      const getInterest = await InterestRepository.getAllInterest();

      if (!getInterest) {
        return {
          status: false,
          status_code: 404,
          message: "Interest not found",
          data: {
            interest: null,
          },
        };
      } else {
        return {
          status: true,
          status_code: 200,
          message: "Interest are available",
          data: {
            interest: getInterest,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { interest: null },
      };
    }
  }

  static async getInterestByComplaintId({ complaintId }) {
    try {
      const getInterest = await InterestRepository.getInterestByComplaintId({
        complaintId: complaintId,
      });
      if (!getInterest) {
        return {
          status: false,
          status_code: 404,
          message: "Interest not found",
          data: {
            interest: null,
          },
        };
      } else {
        return {
          status: true,
          status_code: 200,
          message: "Interest are available",
          data: {
            interest: getInterest,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { interest: null },
      };
    }
  }
}

module.exports = InterestService;
