const CrudRespository = require('./crud-repository');
const { City } = require('../models');

class CityRepository extends CrudRespository {
    constructor() {
        super(City);
    }
}

module.exports = CityRepository;