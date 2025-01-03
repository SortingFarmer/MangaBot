# MangaBot
A simple app that uses the MangaDex api to view, search and follow mangas on discord.

You can add the app [here](https://discord.com/oauth2/authorize?client_id=1319982304872894495).

Want to host it yourself?
Don't forget to add a `token.json` file, which looks like this:
```json
{
    "token": "YOUR_BOT_TOKEN_HERE",
    "mangadexApi": {
        "client": "YOUR_MANGADEX_API_CLIENT_HERE",
        "clientSecret": "YOUR_MANGADEX_API_CLIENTSECRET_HERE" 
    },
    "db": "YOUR_JDBC_CONNECTION_STRING_HERE"
}
```