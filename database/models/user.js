'use strict';
const {
  Model, Sequelize, UUID, UUIDV4, UUIDV1
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    uuid: {
      type: UUID,
      allowNull: false,
      defaultValue: UUIDV1,
      primaryKey: true,
    },
    name: {
      type: sequelize.STRING(90),
      allowNull: false
    },
    nickName: {
      type: sequelize.STRING(120),
      allowNull: false
    },
    email: {
      type: sequelize.STRING(140),
      allowNull: false,
      unique: true
    },
    password: {
      type: sequelize.STRING(255),
      allowNull: false
    },
    avatarSrc: {
      type: sequelize.STRING(255),
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};