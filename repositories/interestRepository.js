const { interests } = require("../models");

class InterestRepository {
  static async createInterest({ userId, lesson, complaintId }) {
    const createInterest = await interests.create({
      userId: userId,
      lesson: lesson,
      complaintId: complaintId,
    });
    return createInterest;
  }

  static async getAllInterest() {
    const getInterest = await interests.findAll();
    return getInterest;
  }

  static async getInterestByComplaintId({ complaintId }) {
    const getInterest = await interests.findOne({
      where: { complaintId: complaintId },
    });
    return getInterest;
  }
}

module.exports = InterestRepository;
