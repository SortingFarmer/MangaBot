const axios = require('axios');
const { embed, mangadex, expire } = require('./config.json');
const ISO6391 = require('iso-639-1');
const { ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, AttachmentBuilder, AutoModerationRuleKeywordPresetType } = require('discord.js');
const emoji = require('./emojis.json');
const { mangaFunFacts } = require('./funfacts.json');

module.exports = {
    wait: function(ms) { 
        return new Promise(resolve => setTimeout(resolve, ms)); 
    },
    /**
     * Get mangas
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
            sort = typeof sort === 'object' && sort !== null ? sort : {};
    
            const order = {};
            for (const [key, value] of Object.entries(sort)) {
                order[`order[${key}]`] = value;
            }
    
            // Your API request
            let tempM = await axios({
                method: 'GET',
                url: `${baseUrl}/manga`,
                params: {
                    includes: ['cover_art', 'author', 'artist', 'tag'],
                    limit: limit,
                    offset: (page * limit),
                    ...order, 
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
            let tempR = await axios({
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
    /**
     * Get a list of some chapters of a manga
     * @param {string} mangaId The id of the manga
     * @returns A chapters object
     */
    fetchChapterData: async function(baseUrl, mangaId, offset = 0, limit = 50) {
        try {
            let sort = {
                "volume": "asc",
                "chapter": "asc"
            };

            sort = typeof sort === 'object' && sort !== null ? sort : {};
    
            const order = {};
            for (const [key, value] of Object.entries(sort)) {
                order[`order[${key}]`] = value;
            }

            let tempC = await axios({
                method: 'GET',
                url: `${baseUrl}/chapter`,
                params: {
                    limit: limit,
                    offset: offset,
                    manga: mangaId,
                    includes: ['user', 'scanlation_group'],
                    contentRating: ['safe', 'suggestive', 'erotica', 'pornographic'],
                    ...order
                },
                validateStatus: function (status) {
                    return (status >= 400 && status < 405) || (status >= 200 && status < 300);
                }
            })

            if (tempC.data.result !== "ok") {
                for (const error of tempC.data.errors) {
                    throw new Error(`Title: ${error.title} Description: ${error.detail}`);
                }
            }
            return tempC;
        } catch (error) {
            this.logger.error(error);
        }
    },
    mangaEmbed: function(manga, ratings, chapterData = undefined) {
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
        let fields = [];
        if (manga.attributes.status == "completed" || manga.attributes.status == "cancelled") {
            if (!manga.attributes.lastVolume == "") {
                lastVolume = `**Last Volume:** ${manga.attributes.lastVolume}\n`;
            }
            if (!manga.attributes.lastChapter == "") {
                lastChapter = `**Last Chapter:** ${manga.attributes.lastChapter}\n`
            }
        }

        let chapterString = "";
        if (chapterData) {
            let char = {
                replyMore: "╠",
                replyNone: "║  ",
                reply: "╚",
                people: "👥",
                person: "👤",
                spacer: emoji.spacer,
            }

            let tempChapters = [];

            for (const chapter of chapterData) {
                let temp = {
                    id: chapter.id,
                    vol: chapter.attributes.volume || 0,
                    chap: chapter.attributes.chapter || 0,
                    lang: ISO6391.getName(chapter.attributes.translatedLanguage.split('-')[0]) || "No language.",
                    group: chapter.relationships.filter(r => r.type === "scanlation_group").map(r => r.attributes?.name) || null,
                    user: chapter.relationships.filter(r => r.type === "user").map(r => r.attributes?.username) || null
                }
                tempChapters.push(temp);
            }

            const result = {};
            
            tempChapters.forEach(item => {
                const { id, vol, chap, lang, group, user } = item;
            
                if (!result[vol]) {
                result[vol] = {};
                }
            
                if (!result[vol][chap]) {
                result[vol][chap] = [];
                }
            
                result[vol][chap].push({ id, lang, group, user });
            });

            const volumes = Object.keys(result);
            volumes.forEach((vol, volIndex) => {
                chapterString += `Volume ${vol}\n`;
                const chapters = Object.keys(result[vol]);
                chapters.forEach((chap, chapIndex) => {
                    const prespace = chapIndex === chapters.length - 1 ? char.reply : char.replyMore;
                chapterString += `${prespace} Chapter ${chap}\n`;
                result[vol][chap].forEach((item, index) => {
                    const spacer =
                    chapIndex === chapters.length - 1 ? char.spacer : char.replyNone;
                    const prefix =
                    index === result[vol][chap].length - 1 ? char.reply : char.replyMore;
                    chapterString += `${spacer}${prefix} ${item.lang} - ${/*char.people} ${item.group.join(", ")}, ${*/char.person} ${item.user.join(", ")}\n`;
                });
                });
            });
        }

        fields.push({
            name: "**Description**",
            value: manga.attributes.description.en?.length > 1024 ? manga.attributes.description.en.substring(0, 1021) + "..." : manga.attributes.description.en || "No description available."
        })

        fields.push({
            name: "**Alternative titles**",
            value: altTitle.length > 1024 ? altTitle.substring(0, 1021) + "..." : altTitle || "No alternative titles available."
        })

        fields.push({
            name: "**Information**",
            value: `` +
                `**Demographic:** ${manga.attributes.publicationDemographic || "Type not available."}\n` +
                `**Content Rating:** ${manga.attributes.contentRating || "Content rating not available."}\n` +
                `**Authors:** ${manga.relationships.filter(r => r.type === "author").map(r => r.attributes?.name).join(", ") || "Artists not available."}\n` +
                `**Artists:** ${manga.relationships.filter(r => r.type === "artist").map(r => r.attributes?.name).join(", ") || "Artists not available."}\n` +
                `**Status:** ${manga.attributes.status || "Status not available."}\n` +
                `**Original language:** ${ISO6391.getName(manga.attributes.originalLanguage)}\n` +
                `${lastVolume}` +
                `${lastChapter}` +
                `**Year:** ${manga.attributes.year || "Year not available."}\n` +
                `**Tags:** ${manga.attributes.tags.map(r => r.attributes.name.en).join(", ") || "No tags available."}\n` +
                `**Comments:** ${ratings.data.statistics[mangaId].comments?.repliesCount || 0}\n` +
                `**Follows:** ${ratings.data.statistics[mangaId].follows || 0}\n` +
                `**Rating [(Bayesian)](https://www.evanmiller.org/bayesian-average-ratings.html):** ${ratings.data.statistics[mangaId].rating.bayesian?.toFixed(4) || "No rating available."}\n` +
                `**Rating [(Average)](https://en.wikipedia.org/wiki/Average):** ${ratings.data.statistics[mangaId].rating.average?.toFixed(4) || "No rating available."}\n` +
                `**Translated languages:** ${tLanguages || "Translated languages not available"}`
        });
        
        fields.push({
            name: "**Chapters**",
            value: chapterString.length > 1024 ? chapterString.substring(0, 1021) + "..." : chapterString || "No chapters available."
        })

        let result = {
            title: manga.attributes.title.en || manga.attributes.title[Object.keys(manga.attributes.title)[0]],
            description: "",
            color: embed.color,
            fields: fields,
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
        },
        json: function(json) {
            console.log(`[${String(new Date().toLocaleString() + ":" + new Date().getMilliseconds())}] [JSON] ${JSON.stringify(json, null, 2)}`);
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
                        
                        if (componentJson.label) button.setLabel(componentJson.label)    
                        
                        if (componentJson.emoji) button.setEmoji(componentJson.emoji);
    
                        if (componentJson.url) {
                            button.setURL(componentJson.url);
                        } else {
                            button.setCustomId(componentJson.custom_id);
                            button.setDisabled(true);
                        }
                        button.setStyle(componentJson.style);
    
                        components.push(button);
                    } else if (componentJson.type == 3) {
                        const selectMenu = new StringSelectMenuBuilder()
                            .setCustomId(componentJson.custom_id)
                            .setPlaceholder(componentJson.placeholder)
                            .addOptions(componentJson.options.map(option => ({
                                label: option.label,
                                value: option.value,
                                description: option.description,
                                emoji: option.emoji
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
    },
    loading: function(ephemeral = false, title = "Loading", description = "Fetching data") {
        return {
            content: "",
            files: [new AttachmentBuilder(embed.logo, embed.logoName)],
            embeds: [{
                title: title,
                description: `${emoji.loading} ${description}...\n\n\n` +
                `Here is a random funfact:\n` +
                mangaFunFacts[Math.floor(Math.random() * mangaFunFacts.length)],
                color: embed.color,
                fields: [],
                footer: {
                    text: embed.footNote,
                    icon_url: `attachment://${embed.logoName}`
                },
                timestamp: new Date().toISOString()
            }],
            ephemeral: ephemeral,
            components: []
        };
    },
}

module.exports.wait = module.exports.wait.bind(module.exports);
module.exports.fetchMangaData = module.exports.fetchMangaData.bind(module.exports);
module.exports.fetchStatisticsData = module.exports.fetchStatisticsData.bind(module.exports);
module.exports.fetchChapterData = module.exports.fetchChapterData.bind(module.exports);
module.exports.mangaEmbed = module.exports.mangaEmbed.bind(module.exports);
module.exports.logger.info = module.exports.logger.info.bind(module.exports);
module.exports.logger.error = module.exports.logger.error.bind(module.exports);
module.exports.logger.warn = module.exports.logger.warn.bind(module.exports);
module.exports.logger.test = module.exports.logger.test.bind(module.exports);
module.exports.logger.log = module.exports.logger.log.bind(module.exports);
module.exports.logger.json = module.exports.logger.json.bind(module.exports);
module.exports.cloneAndDisableComponents = module.exports.cloneAndDisableComponents.bind(module.exports);
module.exports.disableComponentsAfterTimeout = module.exports.disableComponentsAfterTimeout.bind(module.exports);