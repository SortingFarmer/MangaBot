const axios = require('axios');
const qs = require('qs');
const { Sequelize } = require('sequelize');
const { db } = require('./token.json');
const { embed, mangadex, logs } = require('./config.json');


const sequelize = new Sequelize(db.replace('jdbc:', ''), {
    logging: false
});

module.exports = {
    sequelize,
    wait: function(ms) { 
        return new Promise(resolve => setTimeout(resolve, ms)); 
    },
    fetchMangaData: async function(baseUrl, offset, limit = 100, param = {
        contentRating: ['safe', 'suggestive', 'erotica'],
        order: {
            rating: 'desc',
            followedCount: 'desc'
        }}) {
        try {
            let tempM;
            do {
                tempM = await axios({
                    method: 'GET',
                    url: `${baseUrl}/manga`,
                    params: {
                        includes: ['cover_art', 'author', 'artist', 'tag'],
                        limit: limit,
                        offset: (offset * limit),
                        ...param
                    },
                    paramsSerializer: params => {
                        return qs.stringify(params, { arrayFormat: 'brackets' });
                    },
                    validateStatus: function (status) {
                        return status === 400 || (status >= 200 && status < 300); // Accept status codes 200-299 and 400
                    }
                });
                if (!tempM || tempM.data.result == "error") {
                    console.error(`An error occurred :c\nTitle: ${tempM?.data?.errors?.[0]?.title}\nDescription: ${tempM?.data?.errors?.[0]?.detail}`);
                    break; // Exit the loop if there's an error
                }
            } while (tempM.data.result != 'ok');
            
    
            this.wait(1000);
            console.log("Got " + limit + " mangas of page " + (offset + 1));
    
            let tempR;
            do {
                tempR = await axios({
                    method: 'GET',
                    url: `${baseUrl}/statistics/manga`,
                    params: {
                        manga: tempM.data.data.map(manga => manga.id)
                    },
                    validateStatus: function (status) {
                        return status === 400 || (status >= 200 && status < 300); // Accept status codes 200-299 and 400
                    }
                });
                if (!tempR || tempR.data.result == "error") {
                    console.error(`An error occurred :c\nTitle: ${tempR?.data?.errors?.[0]?.title}\nDescription: ${tempR?.data?.errors?.[0]?.detail}`);
                    break; // Exit the loop if there's an error
                }
            } while (tempR.data.result != 'ok');
    
            this.wait(1000);
            console.log("Got the statistics for the current page of mangas");
    
            return { tempM, tempR };
        } catch (error) {
            if (error.response && error.response.status !== 400) {
                console.error('Error:', error.response.status, error.response.data);
            } else {
                console.error('Error:', error.message);
            }
        }
    },
    mangaEmbed: function(tempM, tempR) {
        const manga = tempM.data.data;
        const mangaId = manga.id;
        let altTitle = "";
        manga.attributes.altTitles.forEach(altTitles => Object.entries(altTitles).forEach(([key, value]) => altTitle += `**${key}:** ${value}\n` ));
        let lastVolume = "";
        let lastChapter = "";
        if (manga.attributes.status == "completed" || manga.attributes.status == "cancelled") {
            if (!manga.attributes.lastVolume == "") {
                lastVolume = `**Last Volume:** ${manga.attributes.lastVolume}\n`;
            }
            if (!manga.attributes.lastChapter == "") {
                lastChapter = `**Last Chapter:** ${manga.attributes.lastChapter}\n`
            }
        }

        let result = {
            title: manga.attributes.title.en,
            description: "",
            color: embed.color,
            fields: [{
                name: "**Description**",
                value: manga.attributes.description.en.length > 1024 ? manga.attributes.description.en.substring(0, 1021) + "..." : manga.attributes.description.en || "No description available."
            },{
                name: "**Alternative Titles**",
                value: altTitle || "No alternative titles available."
            },{
                name: "**Information**",
                value: `` +
                    `**Demographic:** ${manga.attributes.publicationDemographic || "Type not available."}\n` +
                    `**Content Rating:** ${manga.attributes.contentRating}\n` +
                    `**Original language:** ${manga.attributes.originalLanguage}\n` +
                    `**Authors:** ${manga.relationships.filter(r => r.type === "author").map(r => r.attributes?.name).join(", ")}\n` +
                    `**Artists:** ${manga.relationships.filter(r => r.type === "artist").map(r => r.attributes?.name).join(", ")}\n` +
                    `**Status:** ${manga.attributes.status}\n` +
                    `${lastVolume}` +
                    `${lastChapter}` +
                    `**Year:** ${manga.attributes.year}\n` +
                    `**Tags:** ${manga.attributes.tags.map(r => r.attributes.name.en).join(", ")}\n` +
                    `**Comments:** ${tempR.data.statistics[mangaId].comments.repliesCount || 0}\n` +
                    `**Follows:** ${tempR.data.statistics[mangaId].follows}\n` +
                    `**Rating (Bayesian):** ${tempR.data.statistics[mangaId].rating.bayesian.toFixed(2)}\n` +
                    `**Rating (Average):** ${tempR.data.statistics[mangaId].rating.average.toFixed(2)}\n` +
                    `**Translated languages:** ${manga.attributes.availableTranslatedLanguages.join(", ")}`
            }],
            footer: {
                text: embed.footNote,
                icon_url: `attachment://${embed.logoName}`
            },
            timestamp: new Date().toISOString(),
            thumbnail: {
                url: `${mangadex.img}/${mangaId}/${manga.relationships.filter(r => r.type === "cover_art")[0].attributes.fileName}`
            }
        }

        return result;
    }
}

module.exports.wait = module.exports.wait.bind(module.exports);
module.exports.fetchMangaData = module.exports.fetchMangaData.bind(module.exports);
module.exports.mangaEmbed = module.exports.mangaEmbed.bind(module.exports);
