const express = require('express');
const User = require('../models/user');
const router = express.Router();
const AppError = require('../AppError');
const passport = require('passport');

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(e => next(e));
  }
}

router.get('/profile', (req, res) => {
  res.render('profile');
})

//delete user
router.delete('/profile/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await user.remove();
  res.redirect('/');
}));


router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', wrapAsync(async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({
    username,
    email,
  })
  const registeredUser = await User.register(user, password)
  // const hash = await bcrypt.hash(password, 12);
  // req.flash("Success", "Welcome!");
  // await user.save();
  // req.session.user_id = user._id;
  res.redirect('/');

  // catch (e) {
  //   req.flash('error', e.message);
  //   res.redirect('register');
  // }
}))

router.post('/register', wrapAsync(async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email });
  const registeredUser = await User.register(user, password)
  req.login(registeredUser, err => {
    if (err) return next(err);
    res.redirect('/');
  })
}));




router.get('/login', (req, res) => {
  res.render('login')
})

// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });
//   const validPassword = await bcrypt.compare(password, user.password);
//   if (validPassword) {
//     req.session.user_id = user._id;
//     res.redirect('/');
//   }
//   else {
//     res.redirect('/login');
//   }
// })

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  console.log(req.body);
  res.redirect('/');
})

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    // req.flash('success', 'Goodbye!');
    res.redirect('/');
  });
});

// router.post('/logout', (req, res) => {
//   req.session.user_id = null;
//   req.session.destroy();
//   res.redirect('/login');
// })

module.exports = router;