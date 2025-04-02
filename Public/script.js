document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("gradesForm");
    const clusterSelect = document.getElementById("courseCluster");
    const subjectInputsDiv = document.getElementById("subjectInputs");
    const resultsDiv = document.getElementById("results");
    const loadingMessage = document.getElementById("loadingMessage");

    // Cluster Subjects Mapping
    const clusterSubjects = {
        1: ["Mathematics", "Physics", "Chemistry"],
        2: ["Biology", "Chemistry", "Mathematics"],
        3: ["Mathematics", "Business", "English"],
        4: ["English", "Kiswahili", "History"],
        5: ["English", "History", "Kiswahili"],
        6: ["Agriculture", "Biology", "Geography"]
    };

    // Function to dynamically add subject inputs based on cluster
    function updateSubjectInputs() {
        const selectedCluster = clusterSelect.value;
        const subjects = clusterSubjects[selectedCluster] || [];

        // Clear previous inputs
        subjectInputsDiv.innerHTML = "";

        subjects.forEach(subject => {
            const label = document.createElement("label");
            label.textContent = `${subject}:`;
            
            const input = document.createElement("input");
            input.type = "number";
            input.name = subject.toLowerCase();
            input.required = true;
            
            subjectInputsDiv.appendChild(label);
            subjectInputsDiv.appendChild(input);
        });
    }

    // Listen for changes in cluster selection
    clusterSelect.addEventListener("change", updateSubjectInputs);
    updateSubjectInputs(); // Load initially

    // Form Submission
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Show loading message
        loadingMessage.style.display = "block";
        resultsDiv.innerHTML = "";

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        fetch("/check-qualification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            loadingMessage.style.display = "none"; // Hide loading
            resultsDiv.innerHTML = `<h3>Results:</h3><p>${result.message}</p>`;
        })
        .catch(error => {
            loadingMessage.style.display = "none";
            resultsDiv.innerHTML = "<p style='color: red;'>Error processing request.</p>";
        });
    });
});
