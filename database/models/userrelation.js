'use strict';
const {
  Model, UUID, UUIDV4, UUIDV1
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
    uuid: {
      type: UUID,
      allowNull: false,
      defaultValue: UUIDV1,
      primaryKey: true
    },
    fromUserUuid: {
      type: UUID,
      allowNull: false,
    },
    toUserUuid: {
      type: UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserRelation',
  });
  return UserRelation;
};