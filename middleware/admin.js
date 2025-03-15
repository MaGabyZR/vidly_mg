//this will be executed after the authorization middleware function.
module.exports = function (req, res, next){
    if (!req.user.isAdmin) return res.status(403).send('Access denied!');

    next();

}