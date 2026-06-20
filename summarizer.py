import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def get_email_intelligence(prompt_text):
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt_text}],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"}
    )
    return chat_completion.choices[0].message.content