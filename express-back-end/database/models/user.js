'use strict';
const {
  Model, Sequelize, UUID, UUIDV4
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
    uuId: {
      type: UUID,
      allowNull: false,
      defaultValue: UUIDV4,
      primaryKey: true,
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