class ExpressError {
    constructor(statusCode,message){
        // super();
        this.statusCode = statusCode,
        this.message = message
    }
}

module.exports = ExpressError;