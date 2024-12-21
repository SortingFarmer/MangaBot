# MangaBot
A simple app that uses the MangaDex api to view, search and follow mangas on discord.

You can add the app to your server [here](https://discord.com/oauth2/authorize?client_id=1319982304872894495&permissions=274878221376&integration_type=0&scope=bot+applications.commands) or you can add it to your user apps [here](https://discord.com/oauth2/authorize?client_id=1319982304872894495&permissions=274878221376&integration_type=1&scope=applications.commands).

For those who want to use this code for your personal use, you need to create a `token.json` file at the same level of the `main.js` file.
Inside of the `token.json` file you insert the following code. (Note: replace `your_token_here` with your actual discord bot token.)
```json
{
    "token": "your_token_here"
}
```
You will also need to replace all of the variables inside of the `config.json` file.

When starting the bot for the first time type into the console `node deploy-commands.js` and wait for the conformation that it reloaded the commands. Afterwards (and each time you want to start the bot) type `node .` into the console.