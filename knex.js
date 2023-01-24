module.exports = require("knex")({
	client: "mysql",
	connection: {
		host: config.DB_HOST,
		user: config.DB_USER,
		password: config.DB_PASSWORD,
		database: config.DB_NAME,
		timezone: "IST",
	},
	useNullAsDefault: true,
	acquireConnectionTimeout: 300000,
}); 