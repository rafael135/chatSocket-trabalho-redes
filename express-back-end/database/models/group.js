'use strict';
const {
  Model, UUID, UUIDV4, STRING, TEXT
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Group.init({
    uuId: {
      type: UUID,
      allowNull: false,
      defaultValue: UUIDV4,
      primaryKey: true
    },
    name: {
      type: STRING(120),
      allowNull: false
    },
    groupAdmins: {
      type: TEXT("tiny"),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};