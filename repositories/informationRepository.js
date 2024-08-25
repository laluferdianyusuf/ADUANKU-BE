const { informations } = require("../models");

class InformationRepository {
  static async createInformation({ title, descriptions }) {
    const createInformation = await informations.create({
      title: title,
      descriptions: descriptions,
    });
    return createInformation;
  }

  static async deleteInformation({ id }) {
    const deleteInformation = await informations.destroy({ where: { id: id } });
    return deleteInformation;
  }

  static async getAllInformation() {
    const getInformation = await informations.findAll();
    return getInformation;
  }

  static async getInformationById({ id }) {
    const getInformation = await informations.findOne({ where: { id: id } });
    return getInformation;
  }
}

module.exports = InformationRepository;
