'use strict';

const { UUID, UUIDV4, TEXT } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserMessages', {
      uuId: {
        type: UUID,
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true
      },
      fromUserUuId: {
        type: UUID,
        allowNull: false
      },
      toGroupUuId: {
        type: UUID,
        allowNull: false
      },
      body: {
        type: TEXT("tiny"),
        allowNull: false
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
    await queryInterface.dropTable('UserMessages');
  }
};