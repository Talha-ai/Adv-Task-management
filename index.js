const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Task = require('./models/task');
const User = require('./models/user');
const AppError = require('./AppError');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const { isLoggedIn } = require('./middleware');
const dotenv = require("dotenv");

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MONGO CONNECTION OPEN');
  })
  .catch(err => {
    console.log('ERROR!!');
    console.log(err);
  })
//body parser middleware
app.use(express.json()); //allows json request, fetch from client, allows to parse json inf from body
app.use(express.urlencoded({ extended: true })); //allows us to access inf coming from forms
app.use(flash());

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  done(null, await User.findById(id))
})

app.use((req, res, next) => {

  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});


// app.get('/fakeUser', async (req, res) => {
//   const user = new User({ username: 'dsdfds@gmail.com', password: '2423434' });
//   const newUser = await User.register(user, 'woww');
//   res.send(newUser);
// })

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));

const categories = ['To do', 'In progress', 'On hold', 'Done'];

// app.get('/setname', (req, res) => {
//   res.cookie('name', 'talha');
//   res.send("SENT COOKIE");
// })
//cookieparser
// app.use(cookieparser('secret'));
// app.get('/getsignedcookie', (req, res) => {
//   res.cookie('fruit', 'apple', { signed: true })
//   res.send('signed cookie');
// })
// app.get('/verifyfruit', (req, res) => {
//   res.send(res.signedCookies)
// })



app.get("/", isLoggedIn, async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  console.log(tasks)
  res.render('index', { tasks: tasks, categories });

})



// const sessionOptions = { secret: 'secrett', resave: false }
// app.use(session(sessionOptions))
// app.get('/viewcount', (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   }
//   else {
//     req.session.count = 1;
//   }
//   res.send(`view count: ${req.session.count}`);
// })

// app.get('/register', (req, res) => {
//   const { username = 'anonymous' } = req.query;
//   req.session.username = username;
//   res.redirect('/greet');
// })

// app.get('/greet', (req, res) => {
//   const { username } = req.session;
//   res.send(`Welcome back ${username}`);
// })


//tasks api router
const taskRoutes = require('./routes/task');
app.use('/', taskRoutes);  // /tasks: mounted on

const userRoutes = require('./routes/users')
app.use('/', userRoutes);  // /tasks: mounted on



//Static server
app.use(express.static(path.join(__dirname, 'public')))

const handleValidatorErr = err => {
  console.dir(err);
  return new AppError(`validation failed...${err.message}`, 400)
}

app.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name === 'ValidationError') err = handleValidatorErr(err)
  next(err);
})

app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = err;
  res.status(status).send(message)
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT} `));