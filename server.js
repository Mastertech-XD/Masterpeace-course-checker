const express = require("express");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "static")));
app.use(express.json());

let kuccpsData = [];

// Load KUCCPS data from CSV
fs.createReadStream("kuccps_data.csv")
  .pipe(csv())
  .on("data", (row) => {
    kuccpsData.push(row);
  })
  .on("end", () => {
    console.log("KUCCPS data loaded successfully.");
  });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/check_qualification", (req, res) => {
  const userGrades = req.body.grades;
  const selectedClusters = req.body.clusters;

  if (!userGrades || selectedClusters.length < 4) {
    return res.status(400).json({ error: "Please select at least 4 clusters." });
  }

  const weights = { math: 3, eng: 2, kis: 1, sci: 2, hum: 1 };
  const userClusterPoints =
    Object.keys(userGrades).reduce((sum, sub) => sum + userGrades[sub] * weights[sub], 0) /
    Object.values(weights).reduce((a, b) => a + b, 0);

  const qualifiedCourses = kuccpsData.filter(
    (course) =>
      selectedClusters.includes(course.Cluster) &&
      parseFloat(course["Cluster Points"]) <= userClusterPoints
  );

  res.json({ userClusterPoints, qualifiedCourses });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
