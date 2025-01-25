const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("./token.json");

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./db.db3",
	logging: false,
});

const User = sequelize.define("User", {
	userId: {
		type: DataTypes.BIGINT,
		allowNull: false,
		primaryKey: true,
		unique: true,
	},
	mangaList: {
		type: DataTypes.UUID,
		unique: true,
	},
	currentSearch: {
		type: DataTypes.JSON,
		defaultValue: {
			contentRating: ["safe", "suggestive", "erotica"],
		},
		allowNull: false,
	},
	page: {
		type: DataTypes.TINYINT,
		defaultValue: 0,
		allowNull: false,
	},
	limit: {
		type: DataTypes.TINYINT,
		defaultValue: 25,
		allowNull: false,
	},
	order: {
		type: DataTypes.JSON,
		defaultValue: {
			rating: "desc",
			followedCount: "desc",
		},
		allowNull: false,
	},
	banned: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	premium: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	publicList: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	},
});

const SearchTemplate = sequelize.define("SearchTemplate", {
	templateId: {
		type: DataTypes.UUID,
		primaryKey: true,
		unique: true,
		allowNull: false,
		defaultValue: DataTypes.UUIDV4,
	},
	name: {
		type: DataTypes.STRING(100),
		allowNull: false,
	},
	search: {
		type: DataTypes.JSON,
		defaultValue: {
			contentRating: ["safe", "suggestive", "erotica"],
		},
		allowNull: false,
	},
	order: {
		type: DataTypes.JSON,
		defaultValue: {
			rating: "desc",
			followedCount: "desc",
		},
		allowNull: false,
	},
	userId: {
		type: DataTypes.BIGINT,
		references: {
			model: User,
			key: "userId",
		},
		allowNull: false,
	},
});

const Statistic = sequelize.define("Statistic", {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		unique: true,
		allowNull: false,
		defaultValue: DataTypes.UUIDV4,
	},
	name: {
		type: DataTypes.STRING(100),
		allowNull: false,
	},
	type: {
		type: DataTypes.STRING(100),
		allowNull: false,
	},
	uses: {
		type: DataTypes.BIGINT,
		defaultValue: 0,
		allowNull: false,
	},
});

module.exports = { sequelize, User, SearchTemplate, Statistic };
