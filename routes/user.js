const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');

const userControllers = require('../controllers/users');
const { render } = require('ejs');

router
    .route("/signup")
    .get(userControllers.renderSignup)
    .post(wrapAsync(userControllers.signup));


router
    .route("/login")
    .get(userControllers.renderLogin)
    .post(saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }), userControllers.login);


router.get('/logout', userControllers.logout);

module.exports = router;  // Exporting the router