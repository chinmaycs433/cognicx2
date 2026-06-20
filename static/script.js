async function summarizeEmail() {
    // 1. Get the email text from your input field
    // Make sure your HTML has <textarea id="emailInput"></textarea>
    const emailText = document.getElementById('emailInput').value;

    if (!emailText || emailText.trim() === "") {
        alert("Please enter some text to summarize.");
        return;
    }

    try {
        // 2. Send the request to your Flask backend
        const response = await fetch('/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Crucial: Tells Flask to expect JSON
            },
            body: JSON.stringify({ text: emailText }) // Crucial: Send as a JSON string
        });

        // 3. Handle the response
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Something went wrong on the server');
        }

        const data = await response.json();

        // 4. Update the UI with the returned intelligence
        // Assuming your HTML has these IDs:
        document.getElementById('summaryOutput').innerText = data.summary;
        document.getElementById('categoryOutput').innerText = `Category: ${data.category}`;
        document.getElementById('sentimentOutput').innerText = `Sentiment: ${data.sentiment}`;
        document.getElementById('languageOutput').innerText = `Detected Language: ${data.language}`;

    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}