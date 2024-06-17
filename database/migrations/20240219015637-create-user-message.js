'use strict';

const { UUID, UUIDV4, TEXT, UUIDV1, STRING } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserMessages', {
      uuid: {
        type: UUID,
        allowNull: false,
        defaultValue: UUIDV1,
        primaryKey: true
      },
      fromUserUuid: {
        type: UUID,
        allowNull: false
      },
      toUserUuid: {
        type: UUID,
        allowNull: false
      },
      imageUuid: {
        type: UUID,
        allowNull: true
      },
      type: {
        type: STRING(40),
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