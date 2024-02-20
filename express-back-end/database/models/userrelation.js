'use strict';
const {
  Model, UUID, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRelation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserRelation.init({
    uuId: {
      type: UUID,
      allowNull: false,
      defaultValue: UUIDV4,
      primaryKey: true
    },
    fromUserUuId: {
      type: UUID,
      allowNull: false,
    },
    toUserUuId: {
      type: UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserRelation',
  });
  return UserRelation;
};