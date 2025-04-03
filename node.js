const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "static")));

const gradeToPoints = {
    "A": 12, "A-": 11, "B+": 10, "B": 9, "B-": 8,
    "C+": 7, "C": 6, "C-": 5, "D+": 4, "D": 3, "D-": 2, "E": 1
};

// KUCCPS 2025 cutoff data (ensure you load from a database or file)
const kuccpsData = require("./kuccps_data.json"); // Store cutoff data in JSON

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/check_eligibility", (req, res) => {
    const { selectedCluster, grades } = req.body;
    
    if (!selectedCluster || !grades) {
        return res.status(400).json({ error: "Missing data" });
    }

    // Convert grades to points
    let clusterPoints = 0;
    let subjectCount = 0;

    for (const subject in grades) {
        if (gradeToPoints[grades[subject]]) {
            clusterPoints += gradeToPoints[grades[subject]];
            subjectCount++;
        }
    }

    if (subjectCount === 0) {
        return res.status(400).json({ error: "Invalid grades" });
    }

    const calculatedCluster = clusterPoints / subjectCount;

    // Check eligibility based on KUCCPS 2025 cutoff
    const eligibleCourses = kuccpsData.filter(course =>
        course.cluster === selectedCluster && course.cutoff <= calculatedCluster
    );

    res.json({ calculatedCluster, eligibleCourses });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
