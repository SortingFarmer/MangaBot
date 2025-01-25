const { REST, Routes } = require("discord.js");
const { clientId, beta } = require("./config.json");
const { token, tokenBeta } = require("./token.json");
const fs = require("node:fs");
const path = require("node:path");
const { logger } = require("./util.js");
const { sequelize } = require("./db.js");

const currentToken = beta ? tokenBeta : token;
const id = beta ? clientId.beta : clientId.live;

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON());
		} else {
			logger.warn(
				`The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(currentToken);

// and deploy your commands!
(async () => {
	try {
		logger.info(
			`Started refreshing ${commands.length} application (/) commands.`
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			//Routes.applicationCommands(clientId),
			Routes.applicationCommands(id),
			{ body: commands }
		);

		logger.info(
			`Successfully reloaded ${data.length} application (/) commands.`
		);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		logger.error(error);
	}
})();

logger.info("Setting up the Database.");

sequelize
	.authenticate()
	.then(() => {
		logger.info("Connection to Database sucessful!");
	})
	.catch((error) => {
		logger.error(error);
	});

sequelize
	.sync({ force: true })
	.then(() => {
		logger.info("Database configured and tables created!");
	})
	.catch((error) => {
		logger.error(error);
	});
