function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(`from if statement`, req.isAuthenticated())
            return next(); 
        } else{
            console.log(`from else`, req.isAuthenticated())
            res.redirect('/')
        }
    }

module.exports = {
    ensureAuthenticated
}