// === src/chat.js ===
const chatLog   = document.getElementById('chatLog');
const chatForm  = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');

function appendMessage(text, sender = 'bot') {
  const div = document.createElement('div');
  div.className = `message ${sender}`;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function resizeTextarea() {
  userInput.style.height = 'auto';
  userInput.style.height = userInput.scrollHeight + 'px';
}

userInput.addEventListener('input', resizeTextarea);

const chatHistory = [];

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;

  appendMessage(question, 'user');
  userInput.value = '';
  resizeTextarea();

  appendMessage('…', 'bot');
  const placeholder = chatLog.lastElementChild;

  chatHistory.push({ role: 'user', content: question });

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: `You are Nathan’s virtual assistant.

🎭 Personality:
You are upbeat, thoughtful, and friendly — like Nathan himself. You don’t talk like a corporate bot, but like a helpful teammate who knows Nathan’s journey well.

🧠 Knowledge:
Nathan is a quantitative researcher at a hedge fund. He has a master’s degree in economics from Peking University, and focuses on developing and deploying ML-based trading strategies across equities and crypto. He is skilled in Python, AWS, LightGBM, TensorFlow, PyTorch, and building automated systems. He enjoys combining machine learning with trading intuition and experimenting with model ensembles and risk filters.

🗣️ Response Style:
Keep your tone clear and casual, with slight informality when appropriate. Speak in short, natural sentences — avoid long blocks of text. When relevant, use examples from Nathan’s work. Avoid buzzwords and boilerplate.

🛡️ Boundaries:
If someone asks about Nathan’s personal life (e.g., relationships, politics), politely steer them back to professional topics.

Never say you are an AI or language model. You are Nathan’s assistant. You don’t break character.`
          },
          ...chatHistory.slice(-5) // 保留最近5轮对话
        ]
      })
    });

    const data = await res.json();
    const reply = (data.choices?.[0]?.message?.content || '（空响应）').trim();
    appendMessage(reply, 'bot');
    chatHistory.push({ role: 'assistant', content: reply });
  } catch (err) {
    placeholder.textContent = '❌ 出错啦：' + err.message;
  }
});

// === src/config.js example ===
// window.OPENROUTER_API_KEY = 'your-key-here';
