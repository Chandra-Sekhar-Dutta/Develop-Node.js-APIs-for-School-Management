const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { addSchool, getSchools } = require('./database');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Allow CORS for all origins (update for security)
app.use(cors({ origin: '*' }));

// Function to calculate Haversine distance
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// ✅ **POST: Add a school**
app.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const parsedLat = parseFloat(latitude);
    const parsedLon = parseFloat(longitude);

    if (isNaN(parsedLat) || isNaN(parsedLon)) {
        return res.status(400).json({ error: 'Invalid latitude or longitude values' });
    }

    try {
        await addSchool(name, address, parsedLat, parsedLon);
        res.status(201).json({ message: "✅ School added successfully" });
    } catch (error) {
        console.error("❌ Error adding school:", error);
        res.status(500).json({ error: "❌ Internal Server Error" });
    }
});

// ✅ **GET: List Schools Sorted by Proximity**
app.get('/listSchools', async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    if (isNaN(userLat) || isNaN(userLon)) {
        return res.status(400).json({ error: 'Invalid latitude or longitude values' });
    }

    try {
        const results = await getSchools();

        const updatedResults = results.map(school => {
            const schoolLat = parseFloat(school.latitude);
            const schoolLon = parseFloat(school.longitude);

            if (isNaN(schoolLat) || isNaN(schoolLon)) {
                console.error('Invalid school coordinates:', school);
                return { ...school, distance: "Invalid coordinates" };
            }

            return {
                ...school,
                distance: parseFloat(getDistance(userLat, userLon, schoolLat, schoolLon).toFixed(2))
            };
        });

        updatedResults.sort((a, b) => a.distance - b.distance);
        res.json(updatedResults);
    } catch (error) {
        console.error("❌ Error fetching schools:", error);
        res.status(500).json({ error: "❌ Internal Server Error" });
    }
});

// ✅ **Start Server**
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
