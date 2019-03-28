'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/quiz_log',
  {
    logging: false,
    operatorsAliases: false 
  });
const Log = sequelize.define('Log', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  count: {
    type: Sequelize.INTEGER
  },
  judge: {
    type: Sequelize.TEXT
  },
  user: {
    type: Sequelize.STRING
  },
}, {
  freezeTableName: true,
  timestamps: true
});

Log.sync();
module.exports = Log;