"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class victims extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      victims.belongsTo(models.complaints, {
        foreignKey: "complaintId",
      });
    }
  }
  victims.init(
    {
      name: DataTypes.STRING,
      birthday: DataTypes.STRING,
      gender: DataTypes.STRING,
      nik: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      education: DataTypes.STRING,
      // client Parents
      parentName: DataTypes.STRING,
      parentJob: DataTypes.STRING,
      parentAddress: DataTypes.STRING,
      parentNumber: DataTypes.STRING,
      complaintId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "victims",
    }
  );
  return victims;
};
