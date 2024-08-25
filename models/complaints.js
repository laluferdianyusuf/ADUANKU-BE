"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class complaints extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      complaints.hasMany(models.victims, {
        foreignKey: "complaintId",
      });
      complaints.hasMany(models.abusers, {
        foreignKey: "complaintId",
      });
      complaints.hasMany(models.interests, {
        foreignKey: "complaintId",
      });
      complaints.hasMany(models.notes, {
        foreignKey: "complaintId",
      });
    }
  }
  complaints.init(
    {
      // complaint identity
      userId: DataTypes.INTEGER,
      complaintName: DataTypes.STRING,
      complaintAddress: DataTypes.STRING,
      complaintEducate: DataTypes.STRING,
      complaintNumber: DataTypes.STRING,
      complaintRelation: DataTypes.STRING,
      // Companion identity
      companionName: DataTypes.STRING,
      companionAddress: DataTypes.STRING,
      companionEducate: DataTypes.STRING,
      companionNumber: DataTypes.STRING,
      companionRelation: DataTypes.STRING,
      // case form
      caseType: DataTypes.JSON,
      caseViolence: DataTypes.JSON,
      physical: DataTypes.STRING,
      sexual: DataTypes.STRING,
      psychology: DataTypes.STRING,
      economy: DataTypes.STRING,
      chronology: DataTypes.STRING,
      status: DataTypes.STRING,
      isOpened: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "complaints",
    }
  );
  return complaints;
};
