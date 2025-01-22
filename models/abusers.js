"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class abusers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      abusers.belongsTo(models.complaints, {
        foreignKey: "complaintId",
      });
    }
  }
  abusers.init(
    {
      name: DataTypes.STRING,
      birthday: DataTypes.STRING,
      address: DataTypes.STRING,
      gender: DataTypes.STRING,
      education: DataTypes.STRING,
      job: DataTypes.STRING,
      status: DataTypes.STRING,
      relation: DataTypes.STRING,
      complaintId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "abusers",
    }
  );
  return abusers;
};
