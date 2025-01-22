const InformationRepository = require("../repositories/informationRepository");

class InformationService {
  static async createInformation({ title, descriptions }) {
    try {
      if (!title) {
        return {
          status: false,
          status_code: 400,
          message: "title is required",
          data: {
            information: null,
          },
        };
      }

      if (!descriptions) {
        return {
          status: false,
          status_code: 400,
          message: "description is required",
          data: {
            information: null,
          },
        };
      }

      const createInformation = await InformationRepository.createInformation({
        title: title,
        descriptions: descriptions,
      });

      if (createInformation) {
        return {
          status: true,
          status_code: 201,
          message: "Information created successfully",
          data: {
            information: createInformation,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { information: null },
      };
    }
  }

  static async deleteInformation({ id }) {
    try {
      const getInformation = await InformationRepository.getInformationById({
        id: id,
      });

      if (!getInformation) {
        return {
          status: false,
          status_code: 404,
          message: "Information not found",
          data: {
            information: null,
          },
        };
      } else {
        const deleteInformation = await InformationRepository.deleteInformation(
          { id: id }
        );
        return {
          status: true,
          status_code: 200,
          message: "Information deleted successfully",
          data: {
            information: deleteInformation,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { information: null },
      };
    }
  }

  static async getAllInformation() {
    try {
      const getInformation = await InformationRepository.getAllInformation();

      if (!getInformation) {
        return {
          status: false,
          status_code: 404,
          message: "Information not found",
          data: {
            information: null,
          },
        };
      } else {
        return {
          status: true,
          status_code: 200,
          message: "Information are available",
          data: {
            information: getInformation,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { information: null },
      };
    }
  }

  static async getInformationById({ id }) {
    try {
      const getInformation = await InformationRepository.getInformationById({
        id: id,
      });

      if (!getInformation) {
        return {
          status: false,
          status_code: 404,
          message: "Information not found",
          data: {
            information: null,
          },
        };
      } else {
        return {
          status: true,
          status_code: 200,
          message: "Information are available",
          data: {
            information: getInformation,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { information: null },
      };
    }
  }
}

module.exports = InformationService;
