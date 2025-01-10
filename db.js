const { Sequelize, DataTypes } = require("sequelize");
const { db } = require("./token.json");

const sequelize = new Sequelize(String(db), {
    logging: false
});

const User = sequelize.define('User', {
    userid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    mangaList: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
    },
    currentSearch: {
        type: DataTypes.JSON,
        defaultValue: {
            page: 0,
            limit: 25,
            search: {
                contentRating: ['safe', 'suggestive', 'erotica'],
                order: {
                    rating: 'desc',
                    followedCount: 'desc'
                }
            }
        }
    },
    banned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

const SearchTemplate = sequelize.define('SearchTemplate', {
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
        allowNull: false,
    },
    userId: {
        type: DataTypes.BIGINT,
        references: {
            model: User,
            key: 'userId'
        },
        allowNull: false
    }
});

module.exports = { sequelize, User, SearchTemplate };