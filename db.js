const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
    'telegame_db',
    'root',
    'root',
    {
        host: 'master.2d11c241-53d1-4f09-94a4-234bf161bcc8.c.dbaas.selcloud.ru',
        port: '5432',
        dialect: 'postgres'
    }
)