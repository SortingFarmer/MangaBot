const axios = require("axios");
const { embed, mangadex, expire } = require("./config.json");
const ISO6391 = require("iso-639-1");
const {
	ActionRowBuilder,
	ButtonBuilder,
	StringSelectMenuBuilder,
	AttachmentBuilder,
	AutoModerationRuleKeywordPresetType,
} = require("discord.js");
const emoji = require("./emojis.json");
const { mangaFunFacts } = require("./funfacts.json");

const forwardMap = {
	"Latest Upload": '{"latestUploadedChapter":"desc"}',
	"Oldest Upload": '{"latestUploadedChapter":"asc"}',
	"Title Ascending": '{"title":"asc"}',
	"Title Descending": '{"title":"desc"}',
	"Highest rating": '{"rating":"desc"}',
	"Lowest rating": '{"rating":"asc"}',
	"Most follows": '{"followedCount":"desc"}',
	"Fewest follows": '{"followedCount":"asc"}',
	"Recently added": '{"createdAt":"desc"}',
	"Oldest added": '{"createdAt":"asc"}',
	"Year Ascending": '{"year":"asc"}',
	"Year Descending": '{"year":"desc"}',
	Safe: "safe",
	Suggestive: "suggestive",
	Erotica: "erotica",
	Shounen: "shounen",
	Shoujo: "shoujo",
	Seinen: "seinen",
	Josei: "josei",
	Ongoing: "ongoing",
	Completed: "completed",
	Hiatus: "hiatus",
	Cancelled: "cancelled",
	Oneshot: "0234a31e-a729-4e28-9d6a-3f87c4966b9e",
	"Award Winning": "0a39b5a1-b235-4886-a747-1d05d216532d",
	"Official Colored": "320831a8-4026-470b-94f6-8353740e6f04",
	"Long Strip": "3e2b8dae-350e-4ab8-a8ce-016e844b9f0d",
	Anthology: "51d83883-4103-437c-b4b1-731cb73d786c",
	"Fan Colored": "7b2ce280-79ef-4c09-9b58-12b7c23a9b78",
	"Self-Published": "891cf039-b895-47f0-9229-bef4c96eccd4",
	"4-Koma": "b11fda93-8f1d-4bef-b2ed-8803d3733170",
	Doujinshi: "b13b2a48-c720-44a9-9c77-39c9979373fb",
	"Web Comic": "e197df38-d0e7-43b5-9b09-2842d0c326dd",
	Adaptation: "f4122d1c-3b44-44d0-9936-ff7502c39ad3",
	"Full Color": "f5ba408b-0e7a-484d-8d49-4e9125ac96de",
	Thriller: "07251805-a27e-4d59-b488-f0bfbec15168",
	"Sci-Fi": "256c8bd9-4904-4360-bf4f-508a76d67183",
	Historical: "33771934-028e-4cb3-8744-691e866a923e",
	Action: "391b0423-d847-456f-aff0-8b0cfc03066b",
	Psychological: "3b60b75c-a2d7-4860-ab56-05f391bb889c",
	Romance: "423e2eae-a7a2-4a8b-ac03-a8351462d71d",
	Comedy: "4d32cc48-9f00-4cca-9b5a-a839f0764984",
	Mecha: "50880a9d-5440-4732-9afb-8f457127e836",
	"Boys' Love": "5920b825-4181-4a17-beeb-9918b0ff7a30",
	Crime: "5ca48985-9a9d-4bd8-be29-80dc0303db72",
	Sports: "69964a64-2f90-4d33-beeb-f3ed2875eb4c",
	Superhero: "7064a261-a137-4d3a-8848-2d385de3a99c",
	"Magical Girls": "81c836c9-914a-4eca-981a-560dad663e73",
	Adventure: "87cc87cd-a395-47af-b27a-93258283bbc6",
	"Girls' Love": "a3c67850-4684-404e-9b7f-c69850ee5da6",
	Wuxia: "acc803a4-c95a-4c22-86fc-eb6b582d82a2",
	Isekai: "ace04997-f6bd-436e-b261-779182193d3d",
	Philosophical: "b1e97889-25b4-4258-b28b-cd7f4d28ea9b",
	Drama: "b9af3a63-f058-46de-a9a0-e0c13906197a",
	Medical: "c8cbe35b-1b2b-4a3f-9c37-db84c4514856",
	Horror: "cdad7e68-1419-41dd-bdce-27753074a640",
	Fantasy: "cdc58593-87dd-415e-bbc0-2ec27bf404cc",
	"Slice of Life": "e5301a23-ebd9-49dd-a0cb-2add944c7fe9",
	Mystery: "ee968100-4191-4968-93d3-f82d72be7e46",
	Tragedy: "f8f62932-27da-4fe4-8ee1-6779a8c5edba",
	Reincarnation: "0bc90acb-ccc1-44ca-a34a-b9f3a73259d0",
	"Time Travel": "292e862b-2d17-4062-90a2-0356caa4ae27",
	Genderswap: "2bd2e8d0-f146-434a-9b51-fc9ff2c5fe6a",
	Loli: "2d1f5d56-a1e5-4d0d-a961-2193588b08ec",
	"Traditional Games": "31932a7e-5b8e-49a6-9f12-2afa39dc544c",
	Monsters: "36fd93ea-e8b8-445e-b836-358f02b3d33d",
	Demons: "39730448-9a5f-48a2-85b0-a70db87b1233",
	Ghosts: "3bb26d85-09d5-4d2e-880c-c34b974339e9",
	Animals: "3de8c75d-8ee3-48ff-98ee-e20a65c86451",
	Ninja: "489dd859-9b61-4c37-af75-5b18e88daafc",
	Incest: "5bd0e105-4481-44ca-b6e7-7544da56b1a3",
	Survival: "5fff9cde-849c-4d78-aab0-0d52b2ee1d25",
	Zombies: "631ef465-9aba-4afb-b0fc-ea10efe274a8",
	"Reverse Harem": "65761a2a-415e-47f3-bef2-a9dababba7a6",
	"Martial Arts": "799c202e-7daa-44eb-9cf7-8a3c0441531e",
	Samurai: "81183756-1453-4c81-aa9e-f6e1b63be016",
	Mafia: "85daba54-a71c-4554-8a28-9901a8b0afad",
	"Virtual Reality": "8c86611e-fab7-4986-9dec-d1a2f44acdd5",
	"Office Workers": "92d6d951-ca5e-429c-ac78-451071cbf064",
	"Video Games": "9438db5a-7e2a-4ac0-b39e-e0d95a34b8a8",
	"Post-Apocalyptic": "9467335a-1b83-4497-9231-765337a00b96",
	Crossdressing: "9ab53f92-3eed-4e9b-903a-917c86035ee3",
	Magic: "a1f53773-c69a-4ce5-8cab-fffcd90b1565",
	Harem: "aafb99c1-7f60-43fa-b75f-fc9502ce29c7",
	Military: "ac72833b-c4e9-4878-b9db-6c8a4a99444a",
	"School Life": "caaa44eb-cd40-4177-b930-79d3ef2afe87",
	Villainess: "d14322ac-4d6f-4e9b-afd9-629d5f4d8a41",
	Vampires: "d7d1730f-6eb0-4ba6-9437-602cac38664c",
	Delinquents: "da2d50ca-3018-4cc0-ac7a-6b7d472a29ea",
	"Monster Girls": "dd1f77c5-dea9-4e2b-97ae-224af09caf99",
	Shota: "ddefd648-5140-4e5f-ba18-4eca4071d19b",
	Police: "df33b754-73a3-4c54-80e6-1a74a8058539",
	Aliens: "e64f6742-c834-471d-8d72-dd51fc02b835",
	Cooking: "ea2bc92d-1c26-4930-9b7c-d5c0dc1b6869",
	Supernatural: "eabc5b4c-6aff-42f3-b657-3e90cbd00b75",
	Music: "f42fbf9e-188a-447b-9fdc-f19dc1e4d685",
	Gyaru: "fad12b5e-68ba-460e-b933-9ae8318f5b65",
	"Sexual Violence": "97893a4c-12af-4dac-b6be-0dffb353568e",
	Gore: "b29d6a3d-1569-4e7a-8caf-7557bc92cd5d",
};
const reverseMap = {
	'{"latestUploadedChapter":"desc"}': "Latest Upload",
	'{"latestUploadedChapter":"asc"}': "Oldest Upload",
	'{"title":"asc"}': "Title Ascending",
	'{"title":"desc"}': "Title Descending",
	'{"rating":"desc"}': "Highest rating",
	'{"rating":"asc"}': "Lowest rating",
	'{"followedCount":"desc"}': "Most follows",
	'{"followedCount":"asc"}': "Fewest follows",
	'{"createdAt":"desc"}': "Recently added",
	'{"createdAt":"asc"}': "Oldest added",
	'{"year":"asc"}': "Year Ascending",
	'{"year":"desc"}': "Year Descending",
	safe: "Safe",
	suggestive: "Suggestive",
	erotica: "Erotica",
	shounen: "Shounen",
	shoujo: "Shoujo",
	seinen: "Seinen",
	josei: "Josei",
	ongoing: "Ongoing",
	completed: "Completed",
	hiatus: "Hiatus",
	cancelled: "Cancelled",
	"0234a31e-a729-4e28-9d6a-3f87c4966b9e": "Oneshot",
	"0a39b5a1-b235-4886-a747-1d05d216532d": "Award Winning",
	"320831a8-4026-470b-94f6-8353740e6f04": "Official Colored",
	"3e2b8dae-350e-4ab8-a8ce-016e844b9f0d": "Long Strip",
	"51d83883-4103-437c-b4b1-731cb73d786c": "Anthology",
	"7b2ce280-79ef-4c09-9b58-12b7c23a9b78": "Fan Colored",
	"891cf039-b895-47f0-9229-bef4c96eccd4": "Self-Published",
	"b11fda93-8f1d-4bef-b2ed-8803d3733170": "4-Koma",
	"b13b2a48-c720-44a9-9c77-39c9979373fb": "Doujinshi",
	"e197df38-d0e7-43b5-9b09-2842d0c326dd": "Web Comic",
	"f4122d1c-3b44-44d0-9936-ff7502c39ad3": "Adaptation",
	"f5ba408b-0e7a-484d-8d49-4e9125ac96de": "Full Color",
	"07251805-a27e-4d59-b488-f0bfbec15168": "Thriller",
	"256c8bd9-4904-4360-bf4f-508a76d67183": "Sci-Fi",
	"33771934-028e-4cb3-8744-691e866a923e": "Historical",
	"391b0423-d847-456f-aff0-8b0cfc03066b": "Action",
	"3b60b75c-a2d7-4860-ab56-05f391bb889c": "Psychological",
	"423e2eae-a7a2-4a8b-ac03-a8351462d71d": "Romance",
	"4d32cc48-9f00-4cca-9b5a-a839f0764984": "Comedy",
	"50880a9d-5440-4732-9afb-8f457127e836": "Mecha",
	"5920b825-4181-4a17-beeb-9918b0ff7a30": "Boys' Love",
	"5ca48985-9a9d-4bd8-be29-80dc0303db72": "Crime",
	"69964a64-2f90-4d33-beeb-f3ed2875eb4c": "Sports",
	"7064a261-a137-4d3a-8848-2d385de3a99c": "Superhero",
	"81c836c9-914a-4eca-981a-560dad663e73": "Magical Girls",
	"87cc87cd-a395-47af-b27a-93258283bbc6": "Adventure",
	"a3c67850-4684-404e-9b7f-c69850ee5da6": "Girls' Love",
	"acc803a4-c95a-4c22-86fc-eb6b582d82a2": "Wuxia",
	"ace04997-f6bd-436e-b261-779182193d3d": "Isekai",
	"b1e97889-25b4-4258-b28b-cd7f4d28ea9b": "Philosophical",
	"b9af3a63-f058-46de-a9a0-e0c13906197a": "Drama",
	"c8cbe35b-1b2b-4a3f-9c37-db84c4514856": "Medical",
	"cdad7e68-1419-41dd-bdce-27753074a640": "Horror",
	"cdc58593-87dd-415e-bbc0-2ec27bf404cc": "Fantasy",
	"e5301a23-ebd9-49dd-a0cb-2add944c7fe9": "Slice of Life",
	"ee968100-4191-4968-93d3-f82d72be7e46": "Mystery",
	"f8f62932-27da-4fe4-8ee1-6779a8c5edba": "Tragedy",
	"0bc90acb-ccc1-44ca-a34a-b9f3a73259d0": "Reincarnation",
	"292e862b-2d17-4062-90a2-0356caa4ae27": "Time Travel",
	"2bd2e8d0-f146-434a-9b51-fc9ff2c5fe6a": "Genderswap",
	"2d1f5d56-a1e5-4d0d-a961-2193588b08ec": "Loli",
	"31932a7e-5b8e-49a6-9f12-2afa39dc544c": "Traditional Games",
	"36fd93ea-e8b8-445e-b836-358f02b3d33d": "Monsters",
	"39730448-9a5f-48a2-85b0-a70db87b1233": "Demons",
	"3bb26d85-09d5-4d2e-880c-c34b974339e9": "Ghosts",
	"3de8c75d-8ee3-48ff-98ee-e20a65c86451": "Animals",
	"489dd859-9b61-4c37-af75-5b18e88daafc": "Ninja",
	"5bd0e105-4481-44ca-b6e7-7544da56b1a3": "Incest",
	"5fff9cde-849c-4d78-aab0-0d52b2ee1d25": "Survival",
	"631ef465-9aba-4afb-b0fc-ea10efe274a8": "Zombies",
	"65761a2a-415e-47f3-bef2-a9dababba7a6": "Reverse Harem",
	"799c202e-7daa-44eb-9cf7-8a3c0441531e": "Martial Arts",
	"81183756-1453-4c81-aa9e-f6e1b63be016": "Samurai",
	"85daba54-a71c-4554-8a28-9901a8b0afad": "Mafia",
	"8c86611e-fab7-4986-9dec-d1a2f44acdd5": "Virtual Reality",
	"92d6d951-ca5e-429c-ac78-451071cbf064": "Office Workers",
	"9438db5a-7e2a-4ac0-b39e-e0d95a34b8a8": "Video Games",
	"9467335a-1b83-4497-9231-765337a00b96": "Post-Apocalyptic",
	"9ab53f92-3eed-4e9b-903a-917c86035ee3": "Crossdressing",
	"a1f53773-c69a-4ce5-8cab-fffcd90b1565": "Magic",
	"aafb99c1-7f60-43fa-b75f-fc9502ce29c7": "Harem",
	"ac72833b-c4e9-4878-b9db-6c8a4a99444a": "Military",
	"caaa44eb-cd40-4177-b930-79d3ef2afe87": "School Life",
	"d14322ac-4d6f-4e9b-afd9-629d5f4d8a41": "Villainess",
	"d7d1730f-6eb0-4ba6-9437-602cac38664c": "Vampires",
	"da2d50ca-3018-4cc0-ac7a-6b7d472a29ea": "Delinquents",
	"dd1f77c5-dea9-4e2b-97ae-224af09caf99": "Monster Girls",
	"ddefd648-5140-4e5f-ba18-4eca4071d19b": "Shota",
	"df33b754-73a3-4c54-80e6-1a74a8058539": "Police",
	"e64f6742-c834-471d-8d72-dd51fc02b835": "Aliens",
	"ea2bc92d-1c26-4930-9b7c-d5c0dc1b6869": "Cooking",
	"eabc5b4c-6aff-42f3-b657-3e90cbd00b75": "Supernatural",
	"f42fbf9e-188a-447b-9fdc-f19dc1e4d685": "Music",
	"fad12b5e-68ba-460e-b933-9ae8318f5b65": "Gyaru",
	"97893a4c-12af-4dac-b6be-0dffb353568e": "Sexual Violence",
	"b29d6a3d-1569-4e7a-8caf-7557bc92cd5d": "Gore",
};

function get(key) {
	return forwardMap[key] || reverseMap[key] || "Default sorting";
}

module.exports = {
	wait: function (ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
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
	fetchMangaData: async function (
		baseUrl,
		page,
		limit = 100,
		param = {
			contentRating: ["safe", "suggestive", "erotica"],
		},
		sort = {
			rating: "desc",
		}
	) {
		try {
			sort = typeof sort === "object" && sort !== null ? sort : {};

			param.includedTags = [];
			param.excludedTags = [];

			param?.iFormat?.forEach((tag) => {
				param.includedTags.push(tag);
			});
			delete param["iFormat"];

			param?.eFormat?.forEach((tag) => {
				param.excludedTags.push(tag);
			});
			delete param["eFormat"];

			param?.iGenre?.forEach((tag) => {
				param.includedTags.push(tag);
			});
			delete param["iGenre"];

			param?.eGenre?.forEach((tag) => {
				param.excludedTags.push(tag);
			});
			delete param["eGenre"];

			param?.iThemeOne?.forEach((tag) => {
				param.includedTags.push(tag);
			});
			delete param["iThemeOne"];

			param?.eThemeOne?.forEach((tag) => {
				param.excludedTags.push(tag);
			});
			delete param["eThemeOne"];

			param?.iThemeTwo?.forEach((tag) => {
				param.includedTags.push(tag);
			});
			delete param["iThemeTwo"];

			param?.eThemeTwo?.forEach((tag) => {
				param.excludedTags.push(tag);
			});
			delete param["eThemeTwo"];

			const order = {};
			for (const [key, value] of Object.entries(sort)) {
				order[`order[${key}]`] = value;
			}

			// Your API request
			let tempM = await axios({
				method: "GET",
				url: `${baseUrl}/manga`,
				params: {
					includes: ["cover_art", "author", "artist", "tag"],
					limit: limit,
					offset: page * limit,
					...order,
					...param,
				},
				validateStatus: function (status) {
					return (
						(status >= 400 && status < 405) ||
						(status >= 200 && status < 300)
					);
				},
			});

			if (tempM.data.result !== "ok") {
				for (const error of tempM.data.errors) {
					throw new Error(
						`Title: ${error.title} Description: ${error.detail}`
					);
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
				method: "GET",
				url: `${baseUrl}/statistics/manga`,
				params: {
					manga: mangas,
				},
				validateStatus: function (status) {
					return (
						(status >= 400 && status < 405) ||
						(status >= 200 && status < 300)
					);
				},
			});

			if (tempR.data.result != "ok") {
				for (const error of tempR.data.errors) {
					throw new Error(
						`Title: ${error.title} Description: ${error.detail}`
					);
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
	fetchChapterData: async function (
		baseUrl,
		mangaId,
		offset = 0,
		limit = 100
	) {
		try {
			let sort = {
				volume: "asc",
				chapter: "asc",
			};

			sort = typeof sort === "object" && sort !== null ? sort : {};

			const order = {};
			for (const [key, value] of Object.entries(sort)) {
				order[`order[${key}]`] = value;
			}

			let tempC = await axios({
				method: "GET",
				url: `${baseUrl}/chapter`,
				params: {
					limit: limit,
					offset: offset,
					manga: mangaId,
					includes: ["user", "scanlation_group"],
					contentRating: [
						"safe",
						"suggestive",
						"erotica",
						"pornographic",
					],
					...order,
					translatedLanguage: ["en"],
				},
				validateStatus: function (status) {
					return (
						(status >= 400 && status < 405) ||
						(status >= 200 && status < 300)
					);
				},
			});

			if (tempC.data.result !== "ok") {
				for (const error of tempC.data.errors) {
					throw new Error(
						`Title: ${error.title} Description: ${error.detail}`
					);
				}
			}
			return tempC;
		} catch (error) {
			this.logger.error(error);
		}
	},
	mangaEmbed: function (manga, ratings, chapterData = undefined) {
		const mangaId = manga.id;
		let altTitle = "";
		let tLanguages = "";
		manga.attributes.altTitles.forEach((altTitles) => {
			Object.entries(altTitles).forEach(([key, value]) => {
				altTitle += `**${ISO6391.getName(
					key.split("-")[0]
				)}:** ${value}\n`;
			});
		});

		for (
			let i = 0;
			i < manga.attributes.availableTranslatedLanguages.length;
			i++
		) {
			const lang = manga.attributes.availableTranslatedLanguages[i];
			tLanguages += ISO6391.getName(lang.split("-")[0]);
			if (i < manga.attributes.availableTranslatedLanguages.length - 1) {
				tLanguages += ", ";
			}
		}

		let lastVolume = "";
		let lastChapter = "";
		let fields = [];
		if (
			manga.attributes.status == "completed" ||
			manga.attributes.status == "cancelled"
		) {
			if (!manga.attributes.lastVolume == "") {
				lastVolume = `**Last Volume:** ${manga.attributes.lastVolume}\n`;
			}
			if (!manga.attributes.lastChapter == "") {
				lastChapter = `**Last Chapter:** ${manga.attributes.lastChapter}\n`;
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
			};

			let tempChapters = [];

			for (const chapter of chapterData) {
				let temp = {
					id: chapter.id,
					vol: chapter.attributes.volume || 0,
					chap: chapter.attributes.chapter || 0,
					lang: chapter.attributes.translatedLanguage,
					group:
						chapter.relationships
							.filter((r) => r.type === "scanlation_group")
							.map((r) => r.attributes?.name) || null,
					user:
						chapter.relationships
							.filter((r) => r.type === "user")
							.map((r) => r.attributes?.username) || null,
				};
				tempChapters.push(temp);
			}

			const result = {};

			tempChapters.forEach((item) => {
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
					if (chapIndex == 0) {
						chapterString += `${emoji.reply}Chapters: ${chap}`;
					} else {
						chapterString += `, ${chap}`;
					}
				});
				chapterString += `\n`;
			});
		}

		fields.push({
			name: "**Description**",
			value:
				manga.attributes.description.en?.length > 1024
					? manga.attributes.description.en.substring(0, 1021) + "..."
					: manga.attributes.description.en ||
					  "No description available.",
		});

		fields.push({
			name: "**Alternative titles**",
			value:
				altTitle.length > 1024
					? altTitle.substring(0, 1021) + "..."
					: altTitle || "No alternative titles available.",
		});

		fields.push({
			name: "**Information**",
			value:
				`` +
				`**Demographic:** ${
					manga.attributes.publicationDemographic || "None"
				}\n` +
				`**Content Rating:** ${
					manga.attributes.contentRating ||
					"Content rating not available."
				}\n` +
				`**Authors:** ${
					manga.relationships
						.filter((r) => r.type === "author")
						.map((r) => r.attributes?.name)
						.join(", ") || "Artists not available."
				}\n` +
				`**Artists:** ${
					manga.relationships
						.filter((r) => r.type === "artist")
						.map((r) => r.attributes?.name)
						.join(", ") || "Artists not available."
				}\n` +
				`**Status:** ${
					manga.attributes.status || "Status not available."
				}\n` +
				`**Original language:** ${ISO6391.getName(
					manga.attributes.originalLanguage
				)}\n` +
				`${lastVolume}` +
				`${lastChapter}` +
				`**Year:** ${
					manga.attributes.year || "Year not available."
				}\n` +
				`**Tags:** ${
					manga.attributes.tags
						.map((r) => r.attributes.name.en)
						.join(", ") || "No tags available."
				}\n` +
				`**Comments:** ${
					ratings.data.statistics[mangaId].comments?.repliesCount || 0
				}\n` +
				`**Follows:** ${
					ratings.data.statistics[mangaId].follows || 0
				}\n` +
				`**Rating [(Bayesian)](https://www.evanmiller.org/bayesian-average-ratings.html):** ${
					ratings.data.statistics[mangaId].rating.bayesian?.toFixed(
						4
					) || "No rating available."
				}\n` +
				`**Rating [(Average)](https://en.wikipedia.org/wiki/Average):** ${
					ratings.data.statistics[mangaId].rating.average?.toFixed(
						4
					) || "No rating available."
				}\n` +
				`**Translated languages:** ${
					tLanguages.length > 1024
						? tLanguages.substring(0, 1021) + "..."
						: tLanguages || "Translated languages not available"
				}`,
		});

		let note = `Info: Mangadex supports fetching up to 100 chapters per request, and only shows available English-translated chapters.\n\n`;

		fields.push({
			name: "**Chapters**",
			value:
				note +
				(chapterString.length > 1024 - note.length
					? chapterString.substring(0, 1020 - note.length) + "..."
					: chapterString || "No chapters available."),
		});

		let result = {
			title:
				manga.attributes.title.en ||
				manga.attributes.title[Object.keys(manga.attributes.title)[0]],
			description: "",
			color: embed.color,
			fields: fields,
			footer: {
				text: embed.footNote,
				icon_url: `attachment://${embed.logoName}`,
			},
			image: {
				url: `https://og.mangadex.org/og-image/manga/${mangaId}`,
			},
			timestamp: new Date().toISOString(),
			thumbnail: {
				url: `${mangadex.img}/${mangaId}/${
					manga.relationships.filter((r) => r.type === "cover_art")[0]
						.attributes.fileName
				}`,
			},
		};

		return result;
	},
	logger: {
		info: function (msg) {
			console.log(
				`[${String(
					new Date().toLocaleString() +
						":" +
						new Date().getMilliseconds()
				)}] [INFO] ${msg}`
			);
		},
		error: function (error) {
			console.error(
				`[${String(
					new Date().toLocaleString() +
						":" +
						new Date().getMilliseconds()
				)}] [ERROR] A error occured, see more below:\n` +
					`[${String(
						new Date().toLocaleString() +
							":" +
							new Date().getMilliseconds()
					)}] [ERROR] ${error.message}\n` +
					`[${String(
						new Date().toLocaleString() +
							":" +
							new Date().getMilliseconds()
					)}] [ERROR] ${error.stack}`
			);
		},
		warn: function (msg) {
			console.warn(
				`[${String(
					new Date().toLocaleString() +
						":" +
						new Date().getMilliseconds()
				)}] [WARN] ${msg}`
			);
		},
		test: function (msg) {
			console.log(
				`[${String(
					new Date().toLocaleString() +
						":" +
						new Date().getMilliseconds()
				)}] [TEST] ${msg}`
			);
		},
		log: function (msg, type) {
			console.warn(
				`[${String(
					new Date().toLocaleString() +
						":" +
						new Date().getMilliseconds()
				)}] [${type}] ${msg}`
			);
		},
		json: function (json) {
			console.log(
				`[${String(
					new Date().toLocaleString() +
						":" +
						new Date().getMilliseconds()
				)}] [JSON] ${JSON.stringify(json, null, 2)}`
			);
		},
	},
	disableComponentsAfterTimeout: async function (
		interaction,
		components,
		timeout = 600000,
		interval = 60000
	) {
		// 10 minutes
		try {
			let remainingTime = timeout;

			const intervalId = setInterval(() => {
				remainingTime -= interval;
				this.logger.log(
					`Time left: ${remainingTime / 1000} seconds`,
					"COUNTDOWN"
				);

				if (remainingTime <= 0) {
					clearInterval(intervalId);
				}
			}, interval);

			await new Promise((resolve) => setTimeout(resolve, timeout));
			clearInterval(intervalId);

			const disabledComponents =
				this.cloneAndDisableComponents(components);
			await interaction.editReply({ components: disabledComponents });
		} catch (error) {
			this.logger.error(error);
		}
	},
	cloneAndDisableComponents: function (rows) {
		try {
			let resultRows = [];
			for (const row of rows) {
				let tempRow = new ActionRowBuilder();
				let components = [];
				for (const component of row.components) {
					let componentString = JSON.stringify(component, null, 2);
					let componentJson = JSON.parse(componentString);
					if (componentJson.type == 2) {
						const button = new ButtonBuilder();

						if (componentJson.label)
							button.setLabel(componentJson.label);

						if (componentJson.emoji)
							button.setEmoji(componentJson.emoji);

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
							.addOptions(
								componentJson.options.map((option) => ({
									label: option.label,
									value: option.value,
									description: option.description,
									emoji: option.emoji,
								}))
							)
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
	loading: function (
		ephemeral = false,
		title = "Loading",
		description = "Fetching data",
		clearComponents = true,
		clearFields = true,
		interaction = null
	) {
		return {
			content: "",
			files: [new AttachmentBuilder(embed.logo, embed.logoName)],
			embeds: [
				{
					title: title,
					description:
						`${emoji.loading} ${description}...\n\n\n` +
						`Here is a random funfact:\n` +
						mangaFunFacts[
							Math.floor(Math.random() * mangaFunFacts.length)
						],
					color: embed.color,
					fields: clearFields ? [] : interaction.message.fields,
					footer: {
						text: embed.footNote,
						icon_url: `attachment://${embed.logoName}`,
					},
					timestamp: new Date().toISOString(),
				},
			],
			ephemeral: ephemeral,
			components: clearComponents ? [] : interaction.message.components,
		};
	},
	currentSearchFields: function (
		order,
		currentSearch = {
			contentRating: [],
			publicationDemographic: [],
			status: [],
			eFormat: [],
			iFormat: [],
			eGenre: [],
			iGenre: [],
			eThemeOne: [],
			iThemeOne: [],
			eThemeTwo: [],
			iThemeTwo: [],
		}
	) {
		let fields = [];
		let valueString = "";

		if (currentSearch.contentRating?.length > 0)
			valueString +=
				"Content rating: " +
				currentSearch.contentRating.join(", ") +
				"\n";

		if (currentSearch.publicationDemographic?.length > 0)
			valueString +=
				"Publication demographic: " +
				currentSearch.publicationDemographic.join(", ") +
				"\n";

		if (currentSearch.status?.length > 0)
			valueString += "Status: " + currentSearch.status.join(", ") + "\n";

		if (order) valueString += "Order: " + get(order) + "\n";

		fields.push({
			name: "**Main search**",
			value: valueString || "No search filters specified.",
			inline: true,
		});
		valueString = "";

		if (currentSearch.iFormat?.length > 0)
			valueString +=
				"Format: " +
				currentSearch.iFormat
					.map((tag) => {
						return get(tag);
					})
					.join(", ") +
				"\n";

		if (currentSearch.iGenre?.length > 0)
			valueString +=
				"Genre: " +
				currentSearch.iGenre
					.map((tag) => {
						return get(tag);
					})
					.join(", ") +
				"\n";

		if (currentSearch.iThemeOne?.length > 0)
			"Theme¹: " +
				currentSearch.iThemeOne
					.map((tag) => {
						return get(tag);
					})
					.join(", ");

		if (currentSearch.iThemeTwo?.length > 0)
			valueString +=
				"Theme²: " +
				currentSearch.iThemeTwo
					.map((tag) => {
						return get(tag);
					})
					.join(", ");

		fields.push({
			name: "**Included tags**",
			value: valueString || "No tags included.",
			inline: true,
		});
		valueString = "";

		if (currentSearch.eFormat?.length > 0)
			valueString +=
				"Format: " +
				currentSearch.eFormat
					.map((tag) => {
						return get(tag);
					})
					.join(", ") +
				"\n";

		if (currentSearch.eGenre?.length > 0)
			valueString +=
				"Genre: " +
				currentSearch.eGenre
					.map((tag) => {
						return get(tag);
					})
					.join(", ") +
				"\n";

		if (currentSearch.eThemeOne?.length > 0)
			"Theme¹: " +
				currentSearch.eThemeOne
					.map((tag) => {
						return get(tag);
					})
					.join(", ");

		if (currentSearch.eThemeTwo?.length > 0)
			valueString +=
				"Theme²: " +
				currentSearch.eThemeTwo
					.map((tag) => {
						return get(tag);
					})
					.join(", ");

		fields.push({
			name: "**Excluded tags**",
			value: valueString || "No tags excluded.",
			inline: true,
		});
		valueString = "";

		return fields;
	},
};

module.exports.wait = module.exports.wait.bind(module.exports);
module.exports.fetchMangaData = module.exports.fetchMangaData.bind(
	module.exports
);
module.exports.fetchStatisticsData = module.exports.fetchStatisticsData.bind(
	module.exports
);
module.exports.fetchChapterData = module.exports.fetchChapterData.bind(
	module.exports
);
module.exports.mangaEmbed = module.exports.mangaEmbed.bind(module.exports);
module.exports.logger.info = module.exports.logger.info.bind(module.exports);
module.exports.logger.error = module.exports.logger.error.bind(module.exports);
module.exports.logger.warn = module.exports.logger.warn.bind(module.exports);
module.exports.logger.test = module.exports.logger.test.bind(module.exports);
module.exports.logger.log = module.exports.logger.log.bind(module.exports);
module.exports.logger.json = module.exports.logger.json.bind(module.exports);
module.exports.cloneAndDisableComponents =
	module.exports.cloneAndDisableComponents.bind(module.exports);
module.exports.disableComponentsAfterTimeout =
	module.exports.disableComponentsAfterTimeout.bind(module.exports);
module.exports.currentSearchFields = module.exports.currentSearchFields.bind(
	module.exports
);
