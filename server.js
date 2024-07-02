require('dotenv').config();
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route for uploading blogs
app.post('/upload/blog', upload.single('image'), (req, res) => {
    const { title, content, category } = req.body;
    const image = req.file;

    if (!title || !content || !category || !image) {
        return res.status(400).send('All fields are required');
    }

    const query = `INSERT INTO blogs (title, content, imagePath, category) VALUES (?, ?, ?, ?)`;
    const values = [title, content, image.path, category];

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).send('Error uploading blog');
        }
        res.send('Blog uploaded successfully');
    });
});

// Route for retrieving blogs by category
app.get('/blogs/:category', (req, res) => {
    const { category } = req.params;
    const query = `SELECT * FROM blogs WHERE category = ?`;

    db.query(query, [category], (err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving blogs');
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = connection;
