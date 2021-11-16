const router = require("express").Router();
const UserModel = require('../models/User.model')

router.get('/profile', (req, res, next) => {
    const user = req.session.currentUser
    if(!user) {
        res.redirect('/private')
        return;
    }

    console.log({user});
    res.render('auth/profile.hbs', {user})
});

router.get('/main', (req, res, next) => {
    res.render('auth/main.hbs')
});

router.get('/private', (req, res, next) => {
    res.render('auth/private.hbs')
});

/* GET home page */
router.get("/signin", (req, res, next) => {
  res.render('auth/signin.hbs')
});

router.post("/signin", (req, res, next) => {
    const {username, password} = req.body;

    UserModel.find({username})
    .then((result) => {
        if(!result.length) {
            res.redirect('/private')
        }
        else {
            req.session.currentUser = result[0]
            res.redirect('/main')
        }
    }).catch((err) => {
        next(err)
    });
});

router.get("/signup", (req, res, next) => {
    res.render('auth/signup.hbs')
});

router.post("/signup", (req, res, next) => {
    const {username, password} = req.body;

    UserModel.find({username})
        .then((result) => {
            if(result.length) {
                console.log('This is my result: ', result);
                res.redirect('/private')
                return;
            }
            else {
                return UserModel.create({username, password})
            }
        })
        .then((result) => {
            console.log('This is my result: ', result);
            res.redirect('/signin')
        }).catch((err) => {
            next(err)
        });
});

module.exports = router;