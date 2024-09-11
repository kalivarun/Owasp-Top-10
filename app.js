const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;

// Vercel Edge Config Store setup
const EDGE_CONFIG_STORE_URL = 'https://edge-config.vercel.app/api'; // Replace with actual endpoint
const EDGE_CONFIG_ID = 'ecfg_8u2bgfuv8l8mp3dwdpljlu9cmksm'; // Your Edge Config ID
const EDGE_CONFIG_DIGEST = '5bf6b008a9ec05f6870c476d10b53211797aa000f95aae344ae60f9b422286da'; // Your Edge Config Digest

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Added to handle JSON payloads

// Serve index.html as home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Serve dashboard page
app.get('/dashboard', (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Serve home page with profile information
app.get('/home', async (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.redirect('/login');
    }

    try {
        // Fetch profile data from the Edge Config Store
        const response = await axios.get(`${EDGE_CONFIG_STORE_URL}/profiles/${username}`, {
            headers: {
                'Authorization': `Bearer ${EDGE_CONFIG_DIGEST}`
            }
        });
        const profile = response.data;
        res.sendFile(path.join(__dirname, 'public', 'home.html'));
    } catch (err) {
        console.error('Error fetching profile data:', err);
        res.send('Error fetching profile data');
    }
});

// Handle profile form submission
app.post('/api/profile/:username', async (req, res) => {
    const username = req.params.username;
    const { email, phone } = req.body;

    try {
        // Update or insert profile data in the Edge Config Store
        await axios.post(`${EDGE_CONFIG_STORE_URL}/profiles/${username}`, {
            email,
            phone
        }, {
            headers: {
                'Authorization': `Bearer ${EDGE_CONFIG_DIGEST}`
            }
        });
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).send('Error updating profile');
    }
});

// Handle user registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.send('Please provide both username and password');
    }

    try {
        const response = await axios.post(`${EDGE_CONFIG_STORE_URL}/users`, {
            username,
            password
        }, {
            headers: {
                'Authorization': `Bearer ${EDGE_CONFIG_DIGEST}`
            }
        });
        res.send('Registration successful!');
    } catch (err) {
        console.error('Error occurred:', err);
        res.send('Error occurred: ' + err.message);
    }
});

// Handle user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const response = await axios.get(`${EDGE_CONFIG_STORE_URL}/users`, {
            params: { username, password },
            headers: {
                'Authorization': `Bearer ${EDGE_CONFIG_DIGEST}`
            }
        });
        if (response.data.length > 0) {
            res.redirect(`/dashboard?username=${encodeURIComponent(username)}`);
        } else {
            res.redirect('/register');
        }
    } catch (err) {
        console.error('Error occurred:', err);
        res.redirect('/login');
    }
});

// Handle logout
app.get('/logout', (req, res) => {
    // In a real app, you'd handle user session management here
    res.redirect('/login');
});

// Socket.IO setup
let messages = []; // In-memory store for messages

io.on('connection', (socket) => {
    console.log('a user connected');

    // Send all messages to the newly connected client
    socket.emit('load messages', messages);

    // Handle incoming messages
    socket.on('send message', (message) => {
        console.log('Received message:', message); // Debugging
        messages.push(message);
        io.emit('receive message', message); // Broadcast to all clients
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.use(express.static('public'));

// Start server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
