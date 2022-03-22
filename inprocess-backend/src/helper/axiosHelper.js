'use strict';

const axios = require('axios');
const constants = require('../config/constants');

const sendRequest = async (config) => {
    return await axios(config);
};

const AxiosApiCall = async (url, data = {}) => {
    const config = {
        method: 'GET',
        url: url,
        headers: {
            Authorization: `Bearer ${constants.CELXIOS.BEARER_TOKEN}`
        },
        data: data
    };
    return await sendRequest(config);
};

module.exports = { sendRequest, AxiosApiCall };
