import pandas as pd
import numpy as np

from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message": "Flask backend is running!"})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
