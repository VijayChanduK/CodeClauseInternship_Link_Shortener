const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;
const DB_FILE = "database.json";

// Load existing URLs from file or create an empty database
const loadDatabase = () => {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    } catch (error) {
        return {}; // Return an empty object if the file doesn't exist
    }
};

let urlDatabase = loadDatabase();

// Save the updated database to file
const saveDatabase = () => {
    fs.writeFileSync(DB_FILE, JSON.stringify(urlDatabase, null, 2));
};

// Serve a homepage instead of "Cannot GET /"
app.get("/", (req, res) => {
    res.send(`
        <h1>Welcome to the URL Shortener API</h1>
        <p>Use <code>POST /api/shorten</code> to shorten a URL.</p>
    `);
});

// Function to ensure URLs start with http:// or https://
const normalizeUrl = (url) => {
    return url.startsWith("http://") || url.startsWith("https://") ? url : `http://${url}`;
};

// API to shorten URLs
app.post("/api/shorten", (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const normalizedUrl = normalizeUrl(url);
    const shortId = Math.random().toString(36).substr(2, 5);
    urlDatabase[shortId] = normalizedUrl;
    saveDatabase(); // Save to file

    console.log("✅ URL Shortened:", { shortId, longUrl: normalizedUrl });
    res.json({ shortUrl: `http://localhost:${PORT}/${shortId}` });
});

// API to redirect shortened URLs
app.get("/:shortId", (req, res) => {
    const { shortId } = req.params;
    console.log("🔍 Requested Short ID:", shortId);
    console.log("📂 Database Content:", urlDatabase);

    const longUrl = urlDatabase[shortId];
    if (longUrl) {
        console.log("➡️ Redirecting to:", longUrl);
        res.redirect(longUrl);
    } else {
        res.status(404).json({ error: "URL not found" });
    }
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
