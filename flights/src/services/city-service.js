const { StatusCodes } = require('http-status-codes');

const { CityRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');

const cityRepository = new CityRepository();

async function createCity(data) {
    try {
        const city = await cityRepository.create(data);
        return city;
    }
    catch(error) {
        //console.log(error)
        if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            //console.log(explanation);
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new City object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyCity(id) {
    try {
        const response = await cityRepository.destroy(id);
        return response;
    } catch (error) {
        console.log(error);
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('The city you requested to delete in not available', error.statusCode);
        }
        throw new AppError('Cannot fetch data of all the cities', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateCity(id, data) {
    try {
        const response = await cityRepository.update(id, data);
        //console.log(response)
        return response;
    } catch (error) {
        //console.log(error);
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('The city you requested to update in not available', error.statusCode);
        }
        throw new AppError('Cannot fetch data of all the cities', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createCity,
    destroyCity,
    updateCity
}