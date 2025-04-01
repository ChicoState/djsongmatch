from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route("/")
def home():
    songId = request.args.get("songId")
    print(f"Frontend gave us songId: {songId}")
    if songId is None:
        return jsonify(
            {
                "message": "Missing songId parameter from frontend",
            }
        )
    else:
        return jsonify(
            {
                "message": f"Pretend that flask gave you data for songId: {songId}",
            },
        )


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
