from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

# Load KUCCPS data from the document (CSV format assumed after conversion)
df = pd.read_csv('kuccps_data.csv')

@app.route('/check_qualification', methods=['POST'])
def check_qualification():
    data = request.json['grades']
    
    # Sample weightings for cluster calculation
    weights = {'math': 3, 'eng': 2, 'kis': 1, 'sci': 2, 'hum': 1}

    # Compute user's cluster points
    user_cluster = sum(data[subject] * weights[subject] for subject in data) / sum(weights.values())

    # Filter courses where the user qualifies
    qualified_courses = df[df['Cluster Points'] <= user_cluster][['Course', 'University', 'Type']].to_dict(orient='records')

    return jsonify({'user_cluster': user_cluster, 'qualified_courses': qualified_courses})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
