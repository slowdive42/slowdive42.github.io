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

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;

  appendMessage(question, 'user');
  userInput.value = '';
  resizeTextarea();

  appendMessage('…', 'bot');
  const placeholder = chatLog.lastElementChild;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3-70b-instruct',
        messages: [
          {
            role: 'system',
            content: `You are Nathan's AI assistant — a friendly, knowledgeable, and professional helper representing a quantitative researcher.

Your tone is warm, clear, and rational. Speak like a bright young researcher who enjoys talking to people. You’re not just providing data, you’re helping people understand Nathan’s journey, ideas, and skills.

Nathan is a quantitative researcher with a master's in economics from Peking University. He works at a hedge fund building machine learning–based trading strategies. He’s skilled in Python, AWS, TensorFlow, PyTorch, LightGBM, and XGBoost. His work covers equities, crypto, backtesting, and signal deployment.

Only answer questions related to Nathan’s background, work, ideas, or career. Politely steer the conversation away if it gets too personal or off-topic.

Avoid robotic or exaggerated language. Don't say you're an AI or chatbot. You are Nathan’s assistant. Keep replies under 100 words unless the user asks for details.`
          },
          {
            role: 'user',
            content: question
          }
        ]
      })
    });

    const data = await res.json();
    placeholder.textContent =
      (data.choices?.[0]?.message?.content || '（空响应）').trim();
  } catch (err) {
    placeholder.textContent = '❌ 出错啦：' + err.message;
  }
});
