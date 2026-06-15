from flask import Flask, render_template, request, jsonify
from summarizer import summarize_email

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()
    if not data or 'email' not in data:
        return jsonify({"error": "No email content provided"}), 400
    
    email_content = data["email"]
    result = summarize_email(email_content)
    
    return jsonify({
        "summary": result
    })

if __name__ == "__main__":
    app.run(debug=True)