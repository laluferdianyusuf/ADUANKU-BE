const { abusers } = require("../models");

class AbuserRepository {
  static async createAbuser({
    name,
    birthday,
    address,
    education,
    job,
    status,
    relation,
    complaintId,
  }) {
    const createAbuser = await abusers.create({
      name,
      birthday,
      address,
      education,
      job,
      status,
      relation,
      complaintId,
    });

    return createAbuser;
  }

  static async deleteAbuser({ complaintId }) {
    const deleteAbuser = await abusers.destroy({
      where: { complaintId: complaintId },
    });
    return deleteAbuser;
  }
}

module.exports = AbuserRepository;
