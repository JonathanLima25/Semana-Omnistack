const axios = require('axios');
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
const {findConnections, sendMessage} = require('../websocket')
//index, store, show, update, destroy

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();
        return response.json(devs)
    },
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username })
        if (!dev) {
            const apiResponse = await axios.get(`http://api.github.com/users/${github_username}`)

            const { name = login, avatar_url, bio } = apiResponse.data;

            const techArray = parseStringAsArray(techs)

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            let dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techArray,
                location
            })

            // Filtrar as conexões que estão no máximo a 10 km de distancias
            // E que o dev tenha pelo menos uma das tecnologias filtradas
        
            const sendSocketMessageTo = findConnections(
                {latitude, longitude},
                techArray,
                )
                
                sendMessage(sendSocketMessageTo, 'new-dev', dev)
        }

        return response.json(dev);
    }
};