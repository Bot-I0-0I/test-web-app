//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
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Use Netlify function endpoint:
const proxyEndpoint = "/.netlify/functions/deepseek-proxy";

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message");
  msg.classList.add(sender === "You" ? "user" : "ai");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  appendMessage("You", message);
  userInput.value = "";
  appendMessage("Qwen", "Typing...");

  try {
    const res = await fetch(proxyEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "No response.";
    chatBox.lastChild.remove(); // Remove "Typing..."
    appendMessage("Qwen", reply);
  } catch (err) {
    chatBox.lastChild.remove();
    appendMessage("Qwen", `⚠️ Error: ${err.message}`);
    console.error(err);
  }
}
