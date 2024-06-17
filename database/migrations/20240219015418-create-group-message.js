'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GroupMessages', {
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
      },
      fromUserUuid: {
        type: Sequelize.UUID,
        allowNull: false
      },
      toGroupUuid: {
        type: Sequelize.UUID,
        allowNull: false
      },
      imageUuid: {
        type: Sequelize.UUID,
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(40),
        allowNull: false
      },
      body: {
        type: Sequelize.TEXT("medium"),
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
    await queryInterface.dropTable('GroupMessages');
  }
};