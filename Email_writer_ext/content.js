console.log("Email Writer Extension Loaded");

function createAIButton() {

    const button = document.createElement("button");

    button.className = "ai-reply-button";
    button.innerText = "AI Reply";

    /* Button Styling */
    button.style.height = "32px";
    button.style.padding = "0 14px";
    button.style.fontSize = "14px";
    button.style.border = "1px solid #dadce0";
    button.style.borderRadius = "6px";
    button.style.background = "#f1f3f4";
    button.style.cursor = "pointer";
    button.style.marginRight = "8px";

    return button;
}

function createToneSelector() {

    const select = document.createElement("select");

    select.className = "ai-tone-selector";

    /* SAME SIZE AS BUTTON */
    select.style.height = "32px";
    select.style.padding = "0 10px";
    select.style.fontSize = "14px";

    select.style.border = "1px solid #dadce0";
    select.style.borderRadius = "6px";
    select.style.background = "white";

    select.style.marginRight = "8px";
    select.style.cursor = "pointer";

    const tones = [
        "professional",
        "friendly",
        "formal",
        "casual",
        "apologetic"
    ];

    tones.forEach(tone => {

        const option = document.createElement("option");

        option.value = tone;
        option.textContent = tone;

        select.appendChild(option);

    });

    return select;
}

function getEmailContent() {

    const selectors = [
        ".h7",
        ".a3s.aiL",
        ".gmail_quote",
        "[role='presentation']"
    ];

    for (const selector of selectors) {

        const content = document.querySelector(selector);

        if (content) {
            return content.innerText.trim();
        }

    }

    return "";
}

function findComposeToolbar() {

    const selectors = [
        ".btC",
        ".aDh",
        "[role='toolbar']",
        ".gU.Up"
    ];

    for (const selector of selectors) {

        const toolbar = document.querySelector(selector);

        if (toolbar) {
            return toolbar;
        }

    }

    return null;
}

function injectButton() {

    if (document.querySelector(".ai-reply-button")) return;

    const toolbar = findComposeToolbar();

    if (!toolbar) {

        console.log("Toolbar not found");
        return;

    }

    console.log("Injecting AI controls");

    const aiButton = createAIButton();
    const toneSelector = createToneSelector();

    aiButton.addEventListener("click", async () => {

        try {

            aiButton.innerText = "Generating...";
            aiButton.style.pointerEvents = "none";
            aiButton.style.opacity = "0.6";

            const emailContent = getEmailContent();
            const tone = toneSelector.value;

            const response = await fetch("http://localhost:8080/api/email/generate", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: tone
                })

            });

            if (!response.ok) {
                throw new Error("API Request Failed");
            }

            const generatedReply = await response.text();

            const composeBox = document.querySelector(
                "div[role='textbox'][contenteditable='true']"
            );

            if (composeBox) {

                composeBox.focus();
                composeBox.innerText = generatedReply;

            } else {

                console.error("Compose box not found");

            }

        } catch (error) {

            console.error(error);
            alert("Failed to generate reply");

        } finally {

            aiButton.innerText = "AI Reply";
            aiButton.style.pointerEvents = "auto";
            aiButton.style.opacity = "1";

        }

    });

    toolbar.insertBefore(aiButton, toolbar.firstChild);
    toolbar.insertBefore(toneSelector, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {

    for (const mutation of mutations) {

        const addedNodes = Array.from(mutation.addedNodes);

        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (
                node.matches(".aDh, .btC, [role='dialog']") ||
                node.querySelector(".aDh, .btC, [role='dialog']")
            )
        );

        if (hasComposeElements) {

            console.log("Compose Window Detected");

            setTimeout(() => {
                injectButton();
            }, 800);

        }

    }

});

observer.observe(document.body, {
    childList: true,
    subtree: true
});