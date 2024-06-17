'use strict';
const {
  Model, Sequelize, UUID, UUIDV1
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupAdmin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GroupAdmin.init({
    uuid: {
        allowNull: false,
        defaultValue: UUIDV1,
        primaryKey: true,
        type: UUID
    },
    groupUuid: {
      allowNull: false,
      type: UUID
    },
    userUuid: {
      allowNull: false,
      type: UUID
    }
  }, {
    sequelize,
    modelName: 'GroupAdmin',
  });
  return GroupAdmin;
};