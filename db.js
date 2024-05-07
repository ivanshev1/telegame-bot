const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
    'telegame_db',
    'root',
    'root',
    {
        host: 'master.8e642fd1-0941-43f1-a877-44f7121f70fe.c.dbaas.selcloud.ru',
        port: '5432',
        dialect: 'postgres'
    }
)