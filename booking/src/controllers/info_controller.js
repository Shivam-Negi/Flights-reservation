const { StatusCodes } = require('http-status-codes')

const info = (req, res) => {
    return res.status(StatusCodes.OK).json({
        success : true,
        message : 'booking service API is live',
        data : {},
        error : {}
    });
}

module.exports = {
    info
}