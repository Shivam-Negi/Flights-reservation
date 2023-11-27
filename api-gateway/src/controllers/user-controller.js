const { StatusCodes } = require('http-status-codes');

const { UserService } = require('../services');

const { SuccessResponse, ErrorResponse } = require('../utils/common');


/**
 * POST : /user/:id 
 * req-body {}
 */
async function getUser(req, res) {
    try {
        const user = await UserService.getUser(req.params.id);
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch(error) {
        //console.log(error)
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}


/**
 * POST : /signup
 * req-body {email: 'xyz@gmail.com', password: '1jkj1'}
 */

async function createUser(req, res) {    // signup
    try {
        //console.log('inside controller')
        const user = await UserService.createUser({
            email : req.body.email,
            password : req.body.password
        });
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);

    }
    catch(error) {
        console.log(error)
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function signin(req, res) {
    try {
        const user = await UserService.signin({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch (error) {
        console.log(error)
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function addRoleToUser(req, res) {
    try {
        const user = await UserService.addRoleToUser({
            role: req.body.role,
            id: req.body.id
        });
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch (error) {
        console.log(error)
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

module.exports = {
    getUser,
    createUser,
    signin,
    addRoleToUser
}