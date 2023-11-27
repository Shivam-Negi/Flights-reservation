const { StatusCodes } = require('http-status-codes');

const { CityService } = require('../services');

const { SuccessResponse, ErrorResponse } = require('../utils/common');

/**
 * POST : /cities
 * req-body {name: 'Delhi'}
 */

async function createCity(req, res) {
    try {
        //console.log('inside controller')
        const city = await CityService.createCity({
            name : req.body.name
        });
        SuccessResponse.data = city;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);

    }
    catch(error) {
        //console.log(error)
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

/**
 * DELETE : /cities/:id
 * req-body {}
 */
async function destroyCity(req, res) {
    try {
        const city = await CityService.destroyCity(req.params.id);
        SuccessResponse.data = city;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

/**
 * UPDATE : /cities/:id
 * req-body {name: 'Goa'}
 */
async function updateCity(req, res) {
    try {
        const city = await CityService.updateCity(req.params.id, {
            name: req.body.name
        });
        SuccessResponse.data = city;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    createCity,
    destroyCity,
    updateCity
}