'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserRelations', {
      uuid: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        type: Sequelize.UUID
      },
      fromUserUuid: {
        type: Sequelize.UUID,
        allowNull: false
      },
      toUserUuid: {
        type: Sequelize.UUID,
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
    await queryInterface.dropTable('UserRelations');
  }
};