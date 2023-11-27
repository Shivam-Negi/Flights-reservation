const { UserRepository, RoleRepository } = require('../repositories');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

const { Auth, Enums } = require('../utils/common');
const userRepo = new UserRepository();
const roleRepo = new RoleRepository();

async function getUser(id) {
    try {
        const user = await userRepo.get(id);
        return user;
    } catch (error) {
        //console.log(error)
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError('The user you requested is not present', error.statusCode);
        }
        throw new AppError('Cannot fetch data of the user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function createUser(data) {
    try {
        const user = await userRepo.create(data);
        const role = await roleRepo.getRoleByName(Enums.USER_ROLES_ENUMS.CUSTOMER);
        user.addRole(role);
        return user;
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
        throw new AppError('Cannot create a new User object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin(data) {
    try {
        const user = await userRepo.getUserByEmail(data.email);
        // console.log('in service, User details: ', user);
        if(!user) {
            throw new AppError('No user found for the given email', StatusCodes.NOT_FOUND);
        }
        const passwordMatch = Auth.checkPassword(data.password, user.password);
        //console.log("password match : ", passwordMatch);
        if(!passwordMatch) {
            throw new AppError('Invalid password', StatusCodes.BAD_REQUEST);
        }
        const jwt = Auth.createToken({id: user.id, email: user.email});
        return jwt;
    } catch (error) {
        if(error instanceof AppError)   throw error;
        // console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token) {
    try {
        if(!token) {
            throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST);
        }
        const response = Auth.verifyToken(token);
        //console.log("response : ", response);
        const user = await userRepo.get(response.id);
        if(!user) {
            throw new AppError('No user found', StatusCodes.NOT_FOUND);
        }
        return user.id;
    } catch (error) {
        if(error instanceof AppError)   throw error;
        if(error.name == 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
        if(error.name == 'TokenExpiredError') {
            throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
        }
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function addRoleToUser(data) {
    try {
        const user = await userRepo.get(data.id);
        if(!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        const role = await roleRepo.getRoleByName(data.role);
        if(!role) {
            throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
        }
        user.addRole(role);
        return user;
    } catch (error) {
        if(error instanceof AppError)   throw error;
        // console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdmin(id) {
    try {
        const user = await userRepo.get(id);
        if(!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        const adminRole = await roleRepo.getRoleByName(Enums.USER_ROLES_ENUMS.ADMIN);
        if(!adminRole) {
            throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
        }
        return user.hasRole(adminRole);
    } catch (error) {
        if(error instanceof AppError)   throw error;
        // console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdminOrFlightService(id) {
    try {
        const user = await userRepo.get(id);
        if(!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        const adminRole = await roleRepo.getRoleByName(Enums.USER_ROLES_ENUMS.ADMIN);
        const companyRole = await roleRepo.getRoleByName(Enums.USER_ROLES_ENUMS.FLIGHT_COMPANY);
        if(!adminRole || !companyRole) {
            throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
        }
        return (user.hasRole(adminRole) || user.hasRole(companyRole));
    } catch (error) {
        if(error instanceof AppError)   throw error;
        // console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    getUser,
    createUser,
    signin,
    isAuthenticated,
    addRoleToUser,
    isAdmin,
    isAdminOrFlightService
}