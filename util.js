const axios = require('axios');
const { embed, mangadex } = require('./config.json');
const ISO6391 = require('iso-639-1');
const { ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    wait: function(ms) { 
        return new Promise(resolve => setTimeout(resolve, ms)); 
    },
    /**
     * Get mangas and ratings
     * @param {LinkStyle} baseUrl api link
     * @param {Number} page Page nr
     * @param {Number} limit How many mangas to fetch
     * @param {Object} param Search filters
     * @param {Object} sort How to sort the results
     * @returns the mangas and their coresponding ratings
     */
    fetchMangaData: async function(baseUrl, page, limit = 100, param = {
        contentRating: ['safe', 'suggestive', 'erotica']
    }, sort = {
        "rating": "desc"
    }) {
        try {
            let tempM;
    
            // Ensure sort is an object
            sort = typeof sort === 'object' && sort !== null ? sort : {};
    
            // Convert sort object to the required format
            const order = {};
            for (const [key, value] of Object.entries(sort)) {
                order[`order[${key}]`] = value;
            }
    
            // Your API request
            tempM = await axios({
                method: 'GET',
                url: `${baseUrl}/manga`,
                params: {
                    includes: ['cover_art', 'author', 'artist', 'tag'],
                    limit: limit,
                    offset: (page * limit),
                    ...order, // Use the formatted order object
                    ...param
                },
                validateStatus: function (status) {
                    return (status >= 400 && status < 405) || (status >= 200 && status < 300);
                }
            });
    
            if (tempM.data.result !== "ok") {
                for (const error of tempM.data.errors) {
                    throw new Error(`Title: ${error.title} Description: ${error.detail}`);
                }
            }
    
            return tempM;
    
        } catch (error) {
            this.logger.error(error);
        }
    },
    /**
     * Get stats for mangas
     * @param {LinkStyle} baseUrl Mangadex api link
     * @param {Array<string>} mangas An array of ids for the mangas you want the statistics
     * @returns A statistics object
     */
    fetchStatisticsData: async function (baseUrl, mangas) {
        try {
            let tempR;

            // Add a request interceptor
            axios.interceptors.request.use(function (config) {
                // Log the request details
                console.log('Request:', config);
                return config;
            }, function (error) {
                // Handle the error
                return Promise.reject(error);
            });

            // Your API request
            tempR = await axios({
                method: 'GET',
                url: `${baseUrl}/statistics/manga`,
                params: {
                    manga: mangas
                },
                validateStatus: function (status) {
                    return (status >= 400 && status < 405) || (status >= 200 && status < 300);
                }
            });

            if (tempR.data.result != "ok") {
                for (const error of tempR.data.errors) {
                    throw new Error(`Title: ${error.title} Description: ${error.detail}`);
                }
            }

            return tempR;

        } catch (error) {
            this.logger.error(error);
        }
    },
    mangaEmbed: function(tempM, tempR) {
        const manga = tempM.data.data;
        const mangaId = manga.id;
        let altTitle = "";
        let tLanguages = "";
        manga.attributes.altTitles.forEach(altTitles => {
                Object.entries(altTitles).forEach(([key, value]) => {
                    altTitle += `**${ISO6391.getName(key.split('-')[0])}:** ${value}\n`
                })
            });
        
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
            console.log(`[${String(new Date().toLocaleString() + ":" + new Date().getMilliseconds())}] [INFO] ${msg}`);
        },
        error: function(error) {
            console.error(`[${String(new Date().toLocaleString() + ":" + new Date().getMilliseconds())}] [ERROR] A error occured, see more below:\n` +
                `[${String(new Date().toLocaleString() + ":" + new Date().getMilliseconds())}] [ERROR] ${error.message}\n` +
                `[${String(new Date().toLocaleString() + ":" + new Date().getMilliseconds())}] [ERROR] ${error.stack}`);
        },
        warn: function(msg) {
            console.warn(`[${String(new Date().toLocaleString() + ":" + new Date().getMilliseconds())}] [WARN] ${msg}`);
        },
        test: function(msg) {
            console.log(`[${String(new Date().toLocaleString() + ":" + new Date().getMilliseconds())}] [TEST] ${msg}`);
        },
        log: function(msg, type) {
            console.warn(`[${String(new Date().toLocaleString() + ":" + new Date().getMilliseconds())}] [${type}] ${msg}`);
        }
    },
    disableComponentsAfterTimeout: async function(interaction, components, timeout = 600000, interval = 60000) { // 10 minutes
        try {
            let remainingTime = timeout;
        
            const intervalId = setInterval(() => {
                remainingTime -= interval;
                this.logger.log(`Time left: ${remainingTime / 1000} seconds`, 'COUNTDOWN');
        
                if (remainingTime <= 0) {
                    clearInterval(intervalId);
                }
            }, interval);
        
            await new Promise(resolve => setTimeout(resolve, timeout));
            clearInterval(intervalId);
        
            const disabledComponents = this.cloneAndDisableComponents(components);
            await interaction.editReply({ components: disabledComponents });
        } catch (error) {
            this.logger.error(error);
        }
        
    },
    cloneAndDisableComponents: function(rows) {
        try {
            let resultRows = [];
            for (const row of rows) {
                let tempRow = new ActionRowBuilder();
                let components = [];
                for (const component of row.components) {
                    let componentString = JSON.stringify(component, null, 2);
                    let componentJson = JSON.parse(componentString);
                    if (componentJson.type == 2) {
                        const button = new ButtonBuilder()
                            .setLabel(componentJson.label)
                            .setDisabled(true)
                            .setEmoji(componentJson.emoji)
    
                        if (componentJson.url) {
                            button.setURL(componentJson.url);
                        } else {
                            button.setCustomId(componentJson.custom_id);
                        }
                        button.setStyle(componentJson.style);
    
                        components.push(button);
                    } else if (componentJson.type == 3) {
                        const selectMenu = new StringSelectMenuBuilder()
                            .setCustomId(componentJson.custom_id)
                            .setPlaceholder(componentJson.placeholder)
                            .addOptions(componentJson.options.map(option => ({
                                label: option.label,
                                value: option.value
                            })))
                            .setDisabled(true);
    
                        components.push(selectMenu);
                    }
                }
                tempRow.addComponents(...components);
                resultRows.push(tempRow);
            }
            return resultRows;
        } catch (error) {
            this.logger.error(error);
        }
    }        
}

module.exports.wait = module.exports.wait.bind(module.exports);
module.exports.fetchMangaData = module.exports.fetchMangaData.bind(module.exports);
module.exports.mangaEmbed = module.exports.mangaEmbed.bind(module.exports);
module.exports.logger.info = module.exports.logger.info.bind(module.exports);
module.exports.logger.error = module.exports.logger.error.bind(module.exports);
module.exports.logger.warn = module.exports.logger.warn.bind(module.exports);
module.exports.logger.test = module.exports.logger.test.bind(module.exports);
module.exports.logger.log = module.exports.logger.log.bind(module.exports);
module.exports.cloneAndDisableComponents = module.exports.cloneAndDisableComponents.bind(module.exports);
module.exports.disableComponentsAfterTimeout = module.exports.disableComponentsAfterTimeout.bind(module.exports);