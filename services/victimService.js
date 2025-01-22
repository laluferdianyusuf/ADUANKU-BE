const VictimRepository = require("../repositories/victimRepository");

class VictimService {
  static async getVictimByCount() {
    try {
      const getVictims = await VictimRepository.getAllVictims();

      let genderCount = { male: 0, female: 0 };
      let educationCount = {
        TK: 0,
        SD: 0,
        SMP: 0,
        SMA: 0,
        PT: 0,
        others: 0,
      };
      if (!getVictims) {
        return {
          status: false,
          status_code: 404,
          message: "victim not found",
          data: {
            victim: null,
          },
        };
      } else {
        getVictims.map((victim) => {
          switch (victim.gender) {
            case "Laki - Laki":
              genderCount.male++;
              break;
            case "Perempuan":
              genderCount.female++;
              break;
            default:
              break;
          }
        });

        getVictims.map((victim) => {
          switch (victim.education) {
            case "TK":
              educationCount.TK++;
              break;
            case "SD":
              educationCount.SD++;
              break;
            case "SMP":
              educationCount.SMP++;
              break;
            case "SMA":
              educationCount.SMA++;
              break;
            case "Perguruan Tinggi":
              educationCount.PT++;
              break;
            case "Lainnya":
              educationCount.others++;
              break;
            default:
              break;
          }
        });

        return {
          status: true,
          status_code: 200,
          message: "victims are available",
          data: {
            victim: {
              victim: getVictims.length,
              gender: genderCount,
              education: educationCount,
            },
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { victim: null },
      };
    }
  }
}

module.exports = VictimService;
