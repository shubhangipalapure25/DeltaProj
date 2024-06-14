const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res,next) => {
    try {
      let { username, password, email } = req.body;

      let newUser = new User({ username: username, email: email });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      //login after user signup or register in app
      req.login(registeredUser, (err) =>{
        if(err) {
           return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
      
    } catch (err) {
      req.flash("error", err.message);
      console.log(err.message);
      res.redirect("/signup");
    }
  }

  module.exports.renderLoginForm= (req,res) => {
    res.render("users/login.ejs")
    }

module.exports.login = async (req, res) =>{
    req.flash("success", " Welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}    

module.exports.logout = (req,res,next) =>{
    req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success", "You logged out successfully.. ");
    res.redirect("/listings");
    });
    }