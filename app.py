from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import json
import traceback
from summarizer import get_email_intelligence

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///emails.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class EmailRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    raw_text = db.Column(db.Text, nullable=False)
    summary = db.Column(db.Text)
    category = db.Column(db.String(100))
    priority = db.Column(db.String(50))
    sentiment = db.Column(db.String(50))
    language = db.Column(db.String(50))

with app.app_context():
    db.create_all()

@app.route('/summarize', methods=['POST'])
def summarize():
    try:
        data = request.json
        text = data.get('text', '').strip()
        lang = data.get('language', 'English')
        
        # PROMPT FIX: Forces Priority to be English only, maintaining CSS colors
        prompt = f"""Analyze this email and return a JSON object with these keys:
        "summary" (1-2 sentences in {lang}), 
        "category", 
        "priority" (MUST be one of: High, Medium, Low), 
        "sentiment". 
        Email: {text}"""
        
        raw_res = get_email_intelligence(prompt)
        clean_res = raw_res.replace("```json", "").replace("```", "").strip()
        result = json.loads(clean_res)
        
        new = EmailRecord(
            raw_text=text,
            summary=result.get('summary'),
            category=result.get('category'),
            priority=result.get('priority'),
            sentiment=result.get('sentiment'),
            language=lang
        )
        db.session.add(new)
        db.session.commit()
        return jsonify(result)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/history', methods=['GET'])
def history():
    emails = EmailRecord.query.order_by(db.desc(EmailRecord.id)).all()
    return jsonify([{'id': e.id, 'summary': e.summary, 'category': e.category, 'priority': e.priority, 'sentiment': e.sentiment} for e in emails])

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_email(id):
    db.session.delete(EmailRecord.query.get_or_404(id))
    db.session.commit()
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(port=5000, debug=True)