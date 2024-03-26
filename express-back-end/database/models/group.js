'use strict';
const {
  Model, UUID, UUIDV4, STRING, TEXT, UUIDV1
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
    uuid: {
      type: UUID,
      allowNull: false,
      defaultValue: UUIDV1,
      primaryKey: true
    },
    name: {
      type: STRING(120),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};