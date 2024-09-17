// Import required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // PostgreSQL module
const crypto = require('crypto'); // For hashing passwords using MD5

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public', 'Broken-access-control')));
app.use(express.static(path.join(__dirname, '..', 'public', 'Crypto-graphic-failure'))); // Serve static files for cryptographic failure

// PostgreSQL connection setup
const pool = new Pool({
    user: process.env.PG_USER || 'default',
    host: process.env.PG_HOST || 'ep-fragrant-forest-a4w4801s-pooler.us-east-1.aws.neon.tech',
    database: process.env.PG_DATABASE || 'verceldb',
    password: process.env.PG_PASSWORD || 'hAcK51xzCEoH',
    port: process.env.PG_PORT || 5432, // default PostgreSQL port
    ssl: {
        rejectUnauthorized: false // This line is needed for some environments; adjust as needed
    }
});

// Route to download store.db
app.get('/dashboard/assets/stored/database/store.db', (req, res) => {
    const filePath = path.join(__dirname, '..', 'public', 'Crypto-graphic-failure', 'store.db');
    res.download(filePath, 'store.db', (err) => {
        if (err) {
            console.error('Error downloading the file:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

// Serve the db.html page
app.get('/dashboard/assets/stored/database/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'Crypto-graphic-failure', 'db.html'));
});
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'public', 'Crypto-graphic-failure')));

// Serve initial dashboard.html
// Serve initial dashboard.html
app.get('/dashboard', (req, res) => {
    const task = req.query.task;
    const user = req.query.user;

    if (!task) {
        // Serve dashboard.html if 'task' query is missing
        res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
    } else if (task === 'bac') {
        if (!user) {
            // Serve login.html if 'task' is 'bac' and 'user' is missing
            res.sendFile(path.join(__dirname, '..', 'public', 'Broken-access-control', 'login.html'));
        } else {
            // Serve the appropriate user page based on the 'user' parameter
            switch (user) {
                case 'am9obgo=': // Base64 for 'john'
                    res.sendFile(path.join(__dirname, '..', 'public', 'Broken-access-control', 'test.html'));
                    break;
                case 'dG9ueQo=': // Base64 for 'tony'
                    res.sendFile(path.join(__dirname, '..', 'public', 'Broken-access-control', 'tony.html'));
                    break;
                case 'YWRtaW4K': // Base64 for 'admin'
                    res.sendFile(path.join(__dirname, '..', 'public', 'Broken-access-control', 'admin.html'));
                    break;
                case 'Y3J5cHRvCg==': // Base64 for 'crypto'
                    res.sendFile(path.join(__dirname, '..', 'public', 'Crypto-graphic-failure', 'crypto.html'));
                    break;
                default:
                    res.status(404).send('404 Not Found');
            }
        }
    } else if (task === 'cgf') {
        if (!user) {
            // Serve login.html if 'task' is 'cgf' and 'user' is missing
            res.sendFile(path.join(__dirname, '..', 'public', 'Crypto-graphic-failure', 'login.html'));
        } else {
            // Serve the appropriate page based on 'user' parameter for cgf task
            switch (user) {
                case 'am9obgo=': // Base64 for 'john'
                    res.sendFile(path.join(__dirname, '..', 'public', 'Broken-access-control', 'test.html'));
                    break;
                case 'dG9ueQo=': // Base64 for 'tony'
                    res.sendFile(path.join(__dirname, '..', 'public', 'Broken-access-control', 'tony.html'));
                    break;
                case 'YWRtaW4K': // Base64 for 'admin'
                    res.sendFile(path.join(__dirname, '..', 'public', 'Broken-access-control', 'admin.html'));
                    break;
                case 'Y3J5cHRvCg==': // Base64 for 'crypto'
                    res.sendFile(path.join(__dirname, '..', 'public', 'Crypto-graphic-failure', 'crypto.html'));
                    break;
                default:
                    res.status(404).send('404 Not Found');
            }
        }
    } else {
        res.status(400).send('Bad Request');
    }
});
// Handle login POST request
app.post('/login', async (req, res) => {
    const { username, password, task } = req.body; // task now comes from the login form

    // Hash the password using MD5
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    try {
        // Query the database for the user
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // Check if the provided password matches the stored password (both hashed)
            if (user.password === hashedPassword) {
                // Check the 'task' to redirect appropriately
                if (task === 'cgf') {
                    // Handle task=cgf case, regardless of the username
                    switch (username) {
                        case 'john':
                            res.redirect('/dashboard?task=cgf&user=am9obgo=');
                            break;
                        case 'tony':
                            res.redirect('/dashboard?task=cgf&user=dG9ueQo=');
                            break;
                        case 'admin':
                            res.redirect('/dashboard?task=cgf&user=YWRtaW4K');
                            break;
                        case 'crypto':
                            res.redirect('/dashboard?task=cgf&user=Y3J5cHRvCg==');
                            break;
                        default:
                            res.status(401).send('Unauthorized');
                    }
                } else {
                    // Handle other tasks like 'bac'
                    switch (username) {
                        case 'john':
                            res.redirect('/dashboard?task=bac&user=am9obgo=');
                            break;
                        case 'tony':
                            res.redirect('/dashboard?task=bac&user=dG9ueQo=');
                            break;
                        case 'admin':
                            res.redirect('/dashboard?task=bac&user=YWRtaW4K');
                            break;
                        case 'crypto':
                            res.redirect('/dashboard?task=cgf&user=Y3J5cHRvCg==');
                            break;
                        default:
                            res.status(401).send('Unauthorized');
                    }
                }
            } else {
                // Invalid password
                res.status(401).send('Unauthorized');
            }
        } else {
            // No user found with the given username
            res.status(401).send('Unauthorized');
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Internal Server Error');
    }
});




// Handle 404 - Page Not Found
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

// Start server
app.listen(PORT, () => {
    console.log(Server running on http://localhost:${PORT});
});
