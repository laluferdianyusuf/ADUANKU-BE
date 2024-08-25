const { victims } = require("../models");

class VictimRepository {
  static async createVictim({
    name,
    birthday,
    gender,
    nik,
    address,
    phoneNumber,
    education,
    parentName,
    parentJob,
    parentAddress,
    parentNumber,
    complaintId,
  }) {
    const createVictim = await victims.create({
      name,
      birthday,
      gender,
      nik,
      address,
      phoneNumber,
      education,
      parentName,
      parentJob,
      parentAddress,
      parentNumber,
      complaintId,
    });

    return createVictim;
  }

  static async deleteVictim({ complaintId }) {
    const deleteVictim = await victims.destroy({
      where: { complaintId: complaintId },
    });
    return deleteVictim;
  }

  static async getAllVictims() {
    const getVictim = await victims.findAll();
    return getVictim;
  }
}

module.exports = VictimRepository;
