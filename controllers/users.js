const User = require('../models/user');

module.exports.renderSignup =(req, res) => {
    res.render('users/signup');
} 

module.exports.signup =async (req, res) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Registered Successfully');
        res.redirect('/listings');
        });
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}


module.exports.renderLogin =(req, res) => {
    res.render('users/login');
}


module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect(res.locals.redirectUrl || '/listings');
}


module.exports.logout = (req, res) => {
    req.logout((err)=>{
        if(err){
            req.flash('error', 'Cannot log out');
            return next(err);
        }
    });
    req.flash('success', 'Logged out successfully');
    res.redirect('/listings');
}