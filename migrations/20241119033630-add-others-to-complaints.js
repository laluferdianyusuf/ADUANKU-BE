"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("complaints", "others", {
      type: Sequelize.TEXT,
      allowNull: true, // Set true/false based on requirements
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("complaints", "others");
  },
};
