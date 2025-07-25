const User = require("../models/user");

module.exports.signUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.postSignUp = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to TravShort!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.postLogin = async (req, res) => {
  req.flash("success", "Welcome to TravShort");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        next(err);
      }
      req.flash("succes", "Successfully LoggedOut!");
      res.redirect("/listings");
    });
  }