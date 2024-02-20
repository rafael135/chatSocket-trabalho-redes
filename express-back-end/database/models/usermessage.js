'use strict';
const {
  Model, UUID, UUIDV4, TEXT
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserMessage.init({
    userUuId: {
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
    },
    body: {
      type: TEXT("medium"),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserMessage',
  });
  return UserMessage;
};