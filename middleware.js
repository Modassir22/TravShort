module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "error please logdIn first!")
        return res.redirect("/login");
    }
    next();
}