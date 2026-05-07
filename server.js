const express = require('express');
const app = express();
const path = require('path');

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (optional)
app.use(express.static(path.join(__dirname, 'public')));

// --- User Data (for simplicity, you can replace with DB later) ---
const users = [
  { id: 1, username: "user1", password: "pass1" },
  { id: 2, username: "user2", password: "pass2" },
  { id:  3, username: "user3", password: "pass3" }
];

// --- correction chatgpt --->
//const express = require('express');
const session = require('express-session');

//const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
  })
);
// ---fin correction --->

// --- Routes ---

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = user; // Store user in session
    res.redirect('/dashboard');
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

// Dashboard (protected route)
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('dashboard', { user: req.session.user });
});

// Logout
app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

// Start server
const PORT = process.env.PORT || 8100;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
