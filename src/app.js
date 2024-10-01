// Import required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // PostgreSQL module
const crypto = require('crypto'); // For hashing passwords using MD5
const basicAuth = require('basic-auth');
const { exec } = require('child_process'); 
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });
const axios = require('axios'); // Import axios

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public', 'Broken-access-control')));
app.use(express.static(path.join(__dirname, '..', 'public', 'Crypto-graphic-failure'))); // Serve static files for cryptographic failure
app.use(express.static(path.join(__dirname, '..', 'public', 'Injection'))); 
app.use(express.static(path.join(__dirname, '..', 'public', 'Insecure-design')));
app.use(express.static(path.join(__dirname, '..', 'public', 'Security-misconfiguration'))); 
app.use(express.static(path.join(__dirname, '..', 'public', 'Vulnerable-and-outdated-components'))); 
app.use(express.static(path.join(__dirname, '..', 'public', 'Identification-and-authentication-failures'))); 
app.use(express.static(path.join(__dirname, '..', 'public', 'Software-and-data-integrity-failures'))); 
app.use(express.static(path.join(__dirname, '..', 'public', 'Security-logging-and-monitoring-failures'))); 
app.use(express.static(path.join(__dirname, '..', 'public', 'Server-side-request-forgery'))); 




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



// Create an admin route to demonstrate SSRF vulnerability
app.get('/admin', (req, res) => {
    res.send(`<h1>This page is currently offline...</h1>
    `);
});

// Serve initial dashboard.html
app.get('/dashboard', async (req, res) => {
    const { task, user, path: urlPath, message } = req.query; // Include 'message' in destructuring

    // SSRF Vulnerability demonstration logic
    if (task === 'ssrf') {
        if (urlPath) {
            try {
                const response = await axios.get(urlPath);
                res.send(`Fetched content from ${urlPath}:<br><br>${response.data}`);
            } catch (error) {
                res.send(`Error: THIS IS THE WAY FOR SSRF - ${error.message}`);
            }
        } else {
            return res.sendFile(path.join(__dirname, '..', 'public', 'Server-side-request-forgery', 'page.html'));
        }
    } 
    // Handle Broken Access Control (BAC)
    else if (task === 'bac') {
        if (!user) {
            return res.sendFile(path.join(__dirname, '..', 'public', 'Broken-access-control', 'login.html'));
        } else {
            switch (user) {
                case 'am9obgo=':
                    return res.sendFile(path.join(__dirname, '..', 'public', 'Broken-access-control', 'test.html'));
                case 'dG9ueQo=':
                    return res.sendFile(path.join(__dirname, '..', 'public', 'Broken-access-control', 'tony.html'));
                case 'YWRtaW4K':
                    return res.sendFile(path.join(__dirname, '..', 'public', 'Broken-access-control', 'admin.html'));
                default:
                    return res.status(404).send('404 Not Found');
            }
        }
    } 
    // Handle Cryptographic Failures (CGF)
    else if (task === 'cgf') {
        if (!user) {
            return res.sendFile(path.join(__dirname, '..', 'public', 'Crypto-graphic-failure', 'login.html'));
        } else {
            switch (user) {
                case 'am9obgo=':
                    return res.sendFile(path.join(__dirname, '..', 'public', 'Broken-access-control', 'test.html'));
                case 'dG9ueQo=':
                    return res.sendFile(path.join(__dirname, '..', 'public', 'Broken-access-control', 'tony.html'));
                case 'YWRtaW4K':
                    return res.sendFile(path.join(__dirname, '..', 'public', 'Broken-access-control', 'admin.html'));
                case 'Y3J5cHRvCg==':
                    return res.sendFile(path.join(__dirname, '..', 'public', 'Crypto-graphic-failure', 'crypto.html'));
                default:
                    return res.status(404).send('404 Not Found');
            }
        }
    } 
    // Handle Injection (IJN) task with CRLF vulnerability
    else if (task === 'ijn') {

        return res.sendFile(path.join(__dirname, '..', 'public', 'Injection', 'login.html'));
        
    } 
    // Other task handlers based on 'task' query parameter
    else if (task) {
        switch (task) {
            case 'isd':
                return res.sendFile(path.join(__dirname, '..', 'public', 'Insecure-design', 'page.html'));
            case 'smc':
                return res.sendFile(path.join(__dirname, '..', 'public', 'Security-misconfiguration', 'page.html'));
            case 'voc':
                return res.sendFile(path.join(__dirname, '..', 'public', 'Vulnerable-and-outdated-components', 'page.html'));
            case 'iaf':
                return res.sendFile(path.join(__dirname, '..', 'public', 'Identification-and-authentication-failures', 'page.html'));
            case 'sdif':
                return res.sendFile(path.join(__dirname, '..', 'public', 'Software-and-data-integrity-failures', 'page.html'));
            case 'slmf':
                return res.sendFile(path.join(__dirname, '..', 'public', 'Security-logging-and-monitoring-failures', 'Server.log'));
            default:
                return res.status(404).send('404 Not Found');
        }
    } 
    // Default response if no 'task' is specified
    else {
        return res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
    }
});

app.post('/login', async (req, res) => {
    const { username, password, task } = req.body;

    // Hash the password using MD5
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    console.log(`Username: ${username}`);
    console.log(`Hashed Password: ${hashedPassword}`);

    try {
        // Query the database for the user
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        console.log(`Database Result:`, result.rows);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log(`Database Stored Password: ${user.password}`);

            // Check if the provided password matches the stored password (both hashed)
            if (user.password === hashedPassword) {
                console.log(`Login successful for user: ${username}`);
                if (task === 'cgf') {
                    // Handle task=cgf case
                    switch (username) {
                        case 'john':
                            return res.redirect('/dashboard?task=cgf&user=am9obgo=');
                        case 'tony':
                            return res.redirect('/dashboard?task=cgf&user=dG9ueQo=');
                        case 'admin':
                            return res.redirect('/dashboard?task=cgf&user=YWRtaW4K');
                        case 'crypto':
                            return res.redirect('/dashboard?task=cgf&user=Y3J5cHRvCg==');
                        default:
                            return res.status(401).send('Unauthorized');
                    }
                } else if (task === 'iaf') {
                    // For task=iaf, redirect to the dashboard page with task and login parameters
                    return res.redirect('/dashboard?task=iaf&login=true');
                } else {
                    // Handle other tasks like 'bac'
                    switch (username) {
                        case 'john':
                            return res.redirect('/dashboard?task=bac&user=am9obgo=');
                        case 'tony':
                            return res.redirect('/dashboard?task=bac&user=dG9ueQo=');
                        case 'admin':
                            return res.redirect('/dashboard?task=bac&user=YWRtaW4K');
                        case 'crypto':
                            return res.redirect('/dashboard?task=cgf&user=Y3J5cHRvCg==');
                        default:
                            return res.status(401).send('Unauthorized');
                    }
                }
            } else {
                console.log('Invalid password');
                return res.status(401).send('Unauthorized');
            }
        } else {
            console.log('User not found');
            return res.status(401).send('Unauthorized');
        }
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).send('Internal Server Error');
    }
});

// Route for handling the dashboard page
// app.get('/dashboard', async (req, res) => {
//     const { task, login } = req.query;

//     // Only render the identification page if the task is 'iaf' and the user is logged in
//     if (task === 'iaf' && login === 'true') {
//         // Fetch all users from the database to display on the page
//         try {
//             const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]); // Adjust query as necessary
//             const users = result.rows; // Get the user data
//             res.render('dashboard', { users }); // Pass the user data to the dashboard template
//         } catch (err) {
//             console.error('Error fetching users:', err);
//             return res.status(500).send('Internal Server Error');
//         }
//     } else {
//         // Handle other task scenarios or return an error
//         return res.status(403).send('Forbidden');
//     }
// });

// New route for handling successful iaf logins
// New route for handling successful iaf logins
// Set up static file serving from the /public directory
app.use(express.static(path.join(__dirname, '../public'))); // Adjust path based on your folder structure

// Other routes...

// New route for handling successful iaf logins
// New route for handling successful iaf logins
app.post('/iaf-login', async (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials
    const hardcodedUsername = 'homelander';
    const hardcodedPassword = 'Wh@ttheHeven@!';

    console.log(`Attempting login for username: ${username}`);

    // Check if the provided username and password match the hardcoded values
    if (username === hardcodedUsername && password === hardcodedPassword) {
        console.log('Login successful!');
        return res.redirect('public/homelander.html'); // Redirect to homelander.html
    } else {
        console.log('Invalid username or password!');
        return res.status(401).json({ error: 'Unauthorized' }); // Return JSON response on unauthorized
    }
});

app.get('/public/homelander.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'homelander.html'));
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Storing user information (in memory for simplicity)


// Storing user information (in memory for simplicity)
let users = {
  'user@example.com': {
    password: 'SuperSecretPassword',
    otp: null,
    otpExpiry: null
  },
  'john@gmail.com': {
    password: 'Y0uHavet0AccessUserTony',
    otp: null,
    otpExpiry: null
  },
  'crypto@gmail.com': {
    password: '0800bumyourmum.1',
    otp: null,
    otpExpiry: null
  },
  'tony@stark.com': {
    password: 'hisdaughter',
    otp: null,
    otpExpiry: null
  },
  'admin@gmail.com.com': {
    password: 'Superuser123',
    otp: null,
    otpExpiry: null
  }
};

// Serve the static files (HTML, CSS, JS)
app.use(express.static('public'));

// Generate OTP and "send" it (in reality, show it on the webpage)
app.post('/generate-otp', (req, res) => {
  const { email } = req.body;
  if (!users[email]) {
    return res.status(404).send('User not found');
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

  users[email].otp = otp;
  users[email].otpExpiry = otpExpiry;

  // For simplicity, instead of sending the OTP, we'll return it in the response
  res.json({ otp });
});

// Verify the OTP and reveal the password
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const user = users[email];

  if (!user) {
    return res.status(404).send('User not found');
  }

  if (user.otp !== otp) {
    return res.status(400).send('Incorrect OTP');
  }

  if (Date.now() > user.otpExpiry) {
    user.otp = null; // Clear expired OTP
    user.otpExpiry = null;
    return res.status(400).send('OTP expired');
  }

  user.otp = null; // Clear OTP after verification
  user.otpExpiry = null;

  return res.json({ password: user.password });
});

// Route to handle the command submission
app.post('/execute', async (req, res) => {
    const userCommand = req.body.command;

    try {
        // Insert command into the database
        await pool.query('INSERT INTO commands (command_text) VALUES ($1)', [userCommand]);

        // Vulnerable part: Execute the command directly without validation
        exec(userCommand, (error, stdout, stderr) => {
            if (error) {
                return res.send(`<h1>Error</h1><pre>${error.message}</pre>`);
            }
            if (stderr) {
                return res.send(`<h1>Stderr</h1><pre>${stderr}</pre>`);
            }
            res.send(`<h1>Command Output</h1><pre>${stdout}</pre>`);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// Endpoint to handle login functionality
// Login route
// Login route


// Endpoint to handle "Forgot Password" functionality
app.post('/forgot-password', (req, res) => {
    const { username, email } = req.body;

    // Check if the username is "homelander"
    if (username === 'homelander') {
        const targetEmail = email; // Use the email from the request body
        const password = 'Wh@ttheHeven@!'; // Replace with the logic to fetch the actual password

        // Create a transporter for sending emails
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Set to true if using 465 port
            auth: {
                user: "sendp301@gmail.com",
                pass: "mmvd gwor ktgq gbiw",
            },
        });

        // Email options
        const mailOptions = {
            from: "sendp301@gmail.com", // Sender address
            to: targetEmail, // Receiver email (from request)
            subject: 'Password Recovery',
            text: Your password is: ${password}, // Sending the password in the email
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error); // Log the error for debugging
                return res.status(500).json({ error: error.message || 'Error sending email' });
            }
            res.json({
                message: 'Password recovery email sent successfully',
                email: targetEmail,
            });
        });
    } else {
        res.status(400).json({ error: 'User does not exist' });
    }
});

// Now you can access your environment variables
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

console.log(smtpUser, smtpPass);




//softeare and intigrity failure 

const fs = require('fs');


// Define the route for your dashboard
app.all('/dashboard', (req, res) => {
    const { task } = req.query;
    const filePathGET = path.join(__dirname, '..', 'public', 'Software-and-data-integrity-failures', 'page.html');
    const filePathPOST = path.join(__dirname, '..', 'public', 'Software-and-data-integrity-failures', 'page2.html');

    // Handle GET requests
    if (req.method === 'GET') {
        if (task === 'sdif') {
            res.status(403); // Set status to Forbidden

            // Read the HTML file and send the Forbidden message
            fs.readFile(filePathGET, 'utf8', (err, data) => {
                if (err) {
                    console.error(err); // Log the error for debugging
                    return res.status(500).send('Internal Server Error');
                }
                res.send(data); // Send the content of the HTML file as the response
            });
        } else {
            res.status(403).send('Access Denied'); // Optional, to indicate access is denied for other tasks
        }
    } 
    // Handle POST requests
    else if (req.method === 'POST') {
        if (task === 'sdif') {
            res.status(200); // Set status to OK

            // Read the HTML file and send the ACCESSED message
            fs.readFile(filePathPOST, 'utf8', (err, data) => {
                if (err) {
                    console.error(err); // Log the error for debugging
                    return res.status(500).send('Internal Server Error');
                }
                res.send(data); // Send the content of the HTML file as the response
            });
        } else {
            res.status(403).send('Access Denied'); // Optional, to indicate access is denied for other tasks
        }
    } else {
        res.status(405).send('Method Not Allowed'); // For unsupported HTTP methods
    }
});


// Route handler for POST requests to /dashboard



// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
