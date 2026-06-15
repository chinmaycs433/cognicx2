def summarize_email(email):

    if not email.strip():
        return """
📌 SUMMARY

No email content provided.


✅ ACTION ITEMS

None


⚡ PRIORITY

LOW
"""


    email = email.replace("\n", " ")

    sentences = email.split(".")


    summary = []
    actions = []


    for sentence in sentences:

        sentence = sentence.strip()

        if len(sentence) > 10:

            summary.append(sentence)


            if any(word in sentence.lower() for word in [
                "must",
                "need",
                "submit",
                "complete",
                "should",
                "required"
            ]):

                actions.append(sentence)



    result = "📌 SUMMARY\n\n"


    for item in summary[:3]:

        result += "• " + item + ".\n"



    result += "\n\n✅ ACTION ITEMS\n\n"



    if actions:

        for item in actions:

            result += "• " + item + ".\n"

    else:

        result += "• No action items detected\n"



    result += "\n\n⚡ PRIORITY\n\n"



    if any(word in email.lower() for word in [
        "urgent",
        "asap",
        "immediately",
        "critical"
    ]):

        result += "HIGH"


    elif any(word in email.lower() for word in [
        "important",
        "soon"
    ]):

        result += "MEDIUM"


    else:

        result += "NORMAL"



    return result