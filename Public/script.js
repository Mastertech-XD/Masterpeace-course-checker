document.addEventListener("DOMContentLoaded", function () {
    const courseClusterSelect = document.getElementById("courseCluster");
    const subjectInputsDiv = document.getElementById("subjectInputs");
    const gradesForm = document.getElementById("gradesForm");
    const resultsDiv = document.getElementById("results");

    const clusterSubjects = {
        "1": ["Mathematics", "Physics", "Chemistry", "Any Group III/IV/V"], // Engineering
        "2": ["Biology", "Chemistry", "Physics/Mathematics", "English/Kiswahili"], // Medicine
        "3": ["Mathematics", "English", "Business Studies/Economics", "Any Group III/IV/V"], // Business
        "4": ["English", "Kiswahili", "Mathematics", "Any Group III/IV/V"], // Education
        "5": ["English", "Kiswahili", "History/CRE/IRE", "Any Group III/IV/V"], // Law
        "6": ["Biology", "Agriculture/Geography", "Mathematics", "Any Group III/IV/V"] // Agriculture
    };

    function updateSubjectInputs() {
        const selectedCluster = courseClusterSelect.value;
        const subjects = clusterSubjects[selectedCluster];

        subjectInputsDiv.innerHTML = "";
        subjects.forEach(subject => {
            subjectInputsDiv.innerHTML += `
                <label for="${subject}">${subject}:</label>
                <input type="number" id="${subject}" name="${subject}" required><br>
            `;
        });
    }

    courseClusterSelect.addEventListener("change", updateSubjectInputs);
    updateSubjectInputs(); // Load subjects initially

    gradesForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(gradesForm);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        fetch("/check-qualification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => response.json())
        .then(data => {
            resultsDiv.innerHTML = `<h3>Results:</h3><p>${data.message}</p>`;
        })
        .catch(error => {
            resultsDiv.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
        });
    });
});
