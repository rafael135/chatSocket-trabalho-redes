'use strict';

const { UUID, UUIDV4, TEXT, STRING, UUIDV1 } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groups', {
      uuid: {
        type: UUID,
        allowNull: false,
        defaultValue: UUIDV1,
        primaryKey: true,
      },
      name: {
        type: STRING(120),
        allowNull: false
      },
      groupImg: {
        type: STRING(255),
        allowNull: true,
        defaultValue: null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Groups');
  }
};