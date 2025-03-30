document.getElementById('gradesForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const grades = {
        math: parseInt(document.getElementById('math').value),
        eng: parseInt(document.getElementById('eng').value),
        kis: parseInt(document.getElementById('kis').value),
        sci: parseInt(document.getElementById('sci').value),
        hum: parseInt(document.getElementById('hum').value)
    };

    const response = await fetch('/check_qualification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grades: grades })
    });

    const data = await response.json();
    
    let resultHTML = `<h2>Cluster Points: ${data.user_cluster.toFixed(2)}</h2>`;
    resultHTML += '<h3>Qualified Courses:</h3><ul>';
    data.qualified_courses.forEach(course => {
        resultHTML += `<li>${course.Course} - ${course.University} (${course.Type})</li>`;
    });
    resultHTML += '</ul>';
    
    document.getElementById('results').innerHTML = resultHTML;
});
