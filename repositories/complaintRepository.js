const { complaints, victims, abusers } = require("../models");

class ComplaintRepository {
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
    caseType,
    caseViolence,
    physical,
    sexual,
    psychology,
    economy,
    chronology,
    status,
    isOpened,
  }) {
    const createComplaint = await complaints.create({
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
      status,
      isOpened,
    });

    return createComplaint;
  }

  static async getComplaintByIdAndUser({ id, userId }) {
    const getComplaint = await complaints.findOne({
      where: { id: id, userId: userId },
    });
    return getComplaint;
  }

  static async deleteComplaintByAdmin({ id }) {
    const deleteComplaint = await complaints.destroy({
      where: { id: id },
    });
    return deleteComplaint;
  }

  static async deleteComplaintById({ id, userId }) {
    const deleteComplaint = await complaints.destroy({
      where: { id: id, userId: userId },
    });
    return deleteComplaint;
  }

  static async getComplaints() {
    const getComplaints = await complaints.findAll();
    return getComplaints;
  }

  static async getComplaintByStatus({ status }) {
    const getComplaint = await complaints.findAll({
      where: { status: status },
    });
    return getComplaint;
  }

  static async getComplaintByStatusAndUser({ status, userId }) {
    const getComplaint = await complaints.findAll({
      where: { status: status, userId: userId },
    });
    return getComplaint;
  }

  static async updateComplaintStatus({ id, status }) {
    const updateComplaint = await complaints.update(
      { status: status },
      {
        where: { id: id },
      }
    );
    return updateComplaint;
  }

  static async getComplaintById({ id }) {
    const getComplaint = await complaints.findOne({
      where: { id: id },
      include: [
        {
          model: victims,
          attributes: [
            "name",
            "birthday",
            "gender",
            "nik",
            "address",
            "phoneNumber",
            "education",
            "parentName",
            "parentJob",
            "parentAddress",
            "parentNumber",
          ],
        },
        {
          model: abusers,
          attributes: [
            "name",
            "birthday",
            "address",
            "education",
            "job",
            "status",
            "relation",
          ],
        },
      ],
    });
    return getComplaint;
  }

  static async getComplaintByUserId({ userId }) {
    const getComplaint = await complaints.findAll({
      where: { userId: userId },
    });
    return getComplaint;
  }

  static async updateComplaintIsOpened({ id, isOpened }) {
    const updateIsOpened = await complaints.update(
      { isOpened: isOpened },
      { where: { id: id } }
    );
    return updateIsOpened;
  }
}

module.exports = ComplaintRepository;
