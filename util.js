const axios = require('axios');
const qs = require('qs');
const { Sequelize } = require('sequelize');
const { db } = require('./token.json');

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
    }
}

module.exports.wait = module.exports.wait.bind(module.exports);
module.exports.fetchMangaData = module.exports.fetchMangaData.bind(module.exports);