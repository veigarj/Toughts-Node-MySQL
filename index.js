const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');

const app = express();

const conn = require('./db/conn');

// Models
const Tought = require('./models/Tought');
const User = require('./models/User');

// Import Routes
const toughtsRoutes = require('./routes/toughtsRoutes');
const authRoutes = require('./routes/authRoutes');

//Import Controler
const ToughtsController = require('./controllers/ToughtsController');

// template engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// receber resposta do body
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// session middleware
app.use(
  session({
    name: 'session',
    secret: 'nosso_secret',
    resave: 'false',
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      expires: new Date(Date.now() + 360000),
      httpOnly: true,
    },
  })
);

// flash messages
app.use(flash());

// public path
app.use(express.static('public'));

// set session to res
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

// Routes
app.use('/toughts', toughtsRoutes);
app.use('/', authRoutes);

app.get('/', ToughtsController.showToughts);

conn
  // forçar ligação di BD no sync
  //.sync({ force: true })
  .sync()

  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
