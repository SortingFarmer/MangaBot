const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { beta } = require("./config.json");
const { token, tokenBeta } = require("./token.json");
const { logger } = require("./util.js");
const { sequelize } = require("./db.js");

const currentToken = beta ? tokenBeta : token;

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			logger.warn(
				`The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => {
			event.execute(...args);
		});
	} else {
		client.on(event.name, (...args) => {
			event.execute(...args);
		});
	}
}

client.login(currentToken);

const handleExit = () => {
	logger.info("Bot is stopping...");
	// Perform any cleanup or save operations here
	sequelize.close(); // Close the Sequelize connection
	process.exit();
};

// Handle bot stopping
process.on("SIGINT", handleExit);
process.on("SIGTERM", handleExit);
process.on("exit", handleExit);
