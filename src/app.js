// Import required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve initial dashboard.html
app.get('/dashboard', (req, res) => {
    const task = req.query.task;
    const user = req.query.user;

    if (!task) {
        // Serve dashboard.html if 'test' query is missing
        res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
    } else if (task === 'bac') {
        if (!user) {
            // Serve login.html if 'test' is 'bac' and 'user' is missing
            res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
        } else {
            // Serve the appropriate user page based on the 'user' parameter
            switch (user) {
                case 'dGVzdAo=': // Base64 for 'test'
                    res.sendFile(path.join(__dirname, '..', 'public', 'test.html'));
                    break;
                case 'dG9ueQo=': // Base64 for 'tony'
                    res.sendFile(path.join(__dirname, '..', 'public', 'tony.html'));
                    break;
                case 'YWRtaW4K': // Base64 for 'admin'
                    res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
                    break;
                default:
                    res.status(404).send('Page Not Found');
            }
        }
    } else {
        res.status(400).send('Bad Request');
    }
});

// Handle login POST request
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Define users and their credentials
    const users = {
        test: { password: 'test', redirect: '/dashboard?task=bac&user=dGVzdAo=' },
        tony: { password: 'stark', redirect: '/dashboard?task=bac&user=dG9ueQo=' },
        admin: { password: 'Superuser123', redirect: '/dashboard?task=bac&user=YWRtaW4K' }
    };

    // Validate user credentials
    if (users[username] && users[username].password === password) {
        res.redirect(users[username].redirect);
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Serve static pages
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'register.html'));
});

// Handle 404 - Page Not Found
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
