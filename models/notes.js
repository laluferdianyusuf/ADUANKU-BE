"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class notes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      notes.belongsTo(models.complaints, {
        foreignKey: "complaintId",
      });
    }
  }
  notes.init(
    {
      officerName: DataTypes.STRING,
      description: DataTypes.STRING,
      complaintId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "notes",
    }
  );
  return notes;
};
