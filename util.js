const axios = require('axios');
const qs = require('qs');
const { embed, mangadex } = require('./config.json');
const ISO6391 = require('iso-639-1');

module.exports = {
    wait: function(ms) { 
        return new Promise(resolve => setTimeout(resolve, ms)); 
    },
    /**
     * Get mangas and ratings
     * @param {LinkStyle} baseUrl api link
     * @param {Number} offset Page nr
     * @param {Number} limit How many mangas to fetch
     * @param {Object} param Search filters
     * @returns the mangas and their coresponding ratings
     */
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
                    validateStatus: function (status) {
                        return status === 400 || (status >= 200 && status < 300); // Accept status codes 200-299 and 400
                    }
                });
                if (!tempM || tempM.data.result == "error") {
                    this.logger.warn(`An error occurred :c\nTitle: ${tempM?.data?.errors?.[0]?.title}\nDescription: ${tempM?.data?.errors?.[0]?.detail}`);
                    break; // Exit the loop if there's an error
                }
            } while (tempM.data.result != 'ok');
            
    
            this.wait(1000);
            this.logger.info("Got " + limit + " mangas of page " + (offset + 1));
    
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
                    this.logger.warn(`Title: ${tempR?.data?.errors?.[0]?.title}\nDescription: ${tempR?.data?.errors?.[0]?.detail}`);
                    break; // Exit the loop if there's an error
                }
            } while (tempR.data.result != 'ok');
    
            this.wait(1000);
            this.logger.info("Got the statistics for the current page of mangas");
    
            return { tempM, tempR };
        } catch (error) {
            if (error.response && error.response.status !== 400) {
                this.logger.error(error);
            } else {
                this.logger.error(error);
            }
        }
    },
    mangaEmbed: function(tempM, tempR) {
        const manga = tempM.data.data;
        const mangaId = manga.id;
        let altTitle = "";
        let tLanguages = "";
        manga.attributes.altTitles.forEach(altTitles => Object.entries(altTitles).forEach(([key, value]) => altTitle += `**${ISO6391.getName(key.split('-')[0])}:** ${value}\n` ));
        
        for (let i = 0; i < manga.attributes.availableTranslatedLanguages.length; i++) {
            const lang = manga.attributes.availableTranslatedLanguages[i];
            tLanguages += ISO6391.getName(lang.split('-')[0]);
            if (i < (manga.attributes.availableTranslatedLanguages.length - 1)) {
                tLanguages += ", "
            }
        }

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
            title: manga.attributes.title.en || manga.attributes.title[Object.keys(manga.attributes.title)[0]],
            description: "",
            color: embed.color,
            fields: [{
                name: "**Description**",
                value: manga.attributes.description.en?.length > 1024 ? manga.attributes.description.en.substring(0, 1021) + "..." : manga.attributes.description.en || "No description available."
            },{
                name: "**Alternative Titles**",
                value: altTitle || "No alternative titles available."
            },{
                name: "**Information**",
                value: `` +
                    `**Demographic:** ${manga.attributes.publicationDemographic || "Type not available."}\n` +
                    `**Content Rating:** ${manga.attributes.contentRating}\n` +
                    `**Original language:** ${ISO6391.getName(manga.attributes.originalLanguage)}\n` +
                    `**Authors:** ${manga.relationships.filter(r => r.type === "author").map(r => r.attributes?.name).join(", ")}\n` +
                    `**Artists:** ${manga.relationships.filter(r => r.type === "artist").map(r => r.attributes?.name).join(", ")}\n` +
                    `**Status:** ${manga.attributes.status}\n` +
                    `${lastVolume}` +
                    `${lastChapter}` +
                    `**Year:** ${manga.attributes.year}\n` +
                    `**Tags:** ${manga.attributes.tags.map(r => r.attributes.name.en).join(", ")}\n` +
                    `**Comments:** ${tempR.data.statistics[mangaId].comments.repliesCount || 0}\n` +
                    `**Follows:** ${tempR.data.statistics[mangaId].follows}\n` +
                    `**Rating (Bayesian):** ${tempR.data.statistics[mangaId].rating.bayesian.toFixed(3)}\n` +
                    `**Rating (Average):** ${tempR.data.statistics[mangaId].rating.average.toFixed(2)}\n` +
                    `**Translated languages:** ${tLanguages}`
            }],
            footer: {
                text: embed.footNote,
                icon_url: `attachment://${embed.logoName}`
            },
            image: {
                url: `https://og.mangadex.org/og-image/manga/${mangaId}`
            },
            timestamp: new Date().toISOString(),
            thumbnail: {
                url: `${mangadex.img}/${mangaId}/${manga.relationships.filter(r => r.type === "cover_art")[0].attributes.fileName}`
            }
        }

        return result;
    },
    logger: {
        info: function(msg) {
            console.log(`[${this.date}] [INFO] ${msg}`);
        },
        error: function(error) {
            console.error(`[${this.date}] [ERROR] A error occured, see more below:\n` +
                `[${this.date}] [ERROR] ${error.message}\n` +
                `[${this.date}] [ERROR] ${error.stack}`);
        },
        warn: function(msg) {
            console.warn(`[${this.date}] [WARN] ${msg}`);
        }
    },
    date: String(new Date().toLocaleString())
}

module.exports.wait = module.exports.wait.bind(module.exports);
module.exports.fetchMangaData = module.exports.fetchMangaData.bind(module.exports);
module.exports.mangaEmbed = module.exports.mangaEmbed.bind(module.exports);
module.exports.logger.info = module.exports.logger.info.bind(module.exports);
module.exports.logger.error = module.exports.logger.error.bind(module.exports);
module.exports.logger.warn = module.exports.logger.warn.bind(module.exports);