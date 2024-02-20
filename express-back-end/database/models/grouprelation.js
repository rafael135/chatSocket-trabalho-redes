'use strict';
const {
  Model, UUID, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupRelation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GroupRelation.init({
    uuId: {
      type: UUID,
      allowNull: false,
      defaultValue: UUIDV4,
      primaryKey: true
    },
    groupUuId: {
      type: UUID,
      allowNull: false
    },
    userUuId: {
      type: UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'GroupRelation',
  });
  return GroupRelation;
};