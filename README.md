# MangaBot
A simple app that uses the MangaDex api to view, search and follow mangas on discord.

You can add the app [here](https://discord.com/oauth2/authorize?client_id=1319982304872894495).

Want to host it yourself?
First go to the `tokenExample.json` file and rename it to `token.json`.
Then fill it out with your bot token, and your mangadex details like username, password, api client and api client secret.
After you have created the file you first need to run `npm install` to install all required dependencies.
Once you have those you will need to run `node initialize.js` to create all the required tables and slash commands for the bot!

And now you are ready to start the bot! The main file to run is `main.js`. (You can run it in your console with `node .`, `node main.js` or `npm start`)