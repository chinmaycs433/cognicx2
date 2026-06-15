async function summarizeEmail() {
    let email = document.getElementById("email").value;
    
    // Show loading
    document.getElementById("loading").style.display = "block";
    
    try {
        let response = await fetch("/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Tell Flask this is JSON
            },
            body: JSON.stringify({ email: email }) // Send as a JSON object
        });

        if (!response.ok) throw new Error("Server error");

        let data = await response.json();
        
        document.getElementById("loading").style.display = "none";
        
        let output = data.summary;

        // Update the fields
        document.getElementById("summary").innerHTML = output.replace(/\n/g, "<br>");
        document.getElementById("actions").innerHTML = "AI has extracted action items from the email.";
        document.getElementById("priority").innerHTML = "Analysis completed";
    }
    catch(error) {
        console.log(error);
        document.getElementById("loading").style.display = "none";
        alert("❌ Something went wrong: " + error.message);
    }
}