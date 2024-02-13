'use strict';
const {
  Model
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
    privateRoom: {
      type: sequelize.STRING(230),
      allowNull: true,
      defaultValue: null,
      unique: true
    },
    name: {
      type: sequelize.STRING(90),
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
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};