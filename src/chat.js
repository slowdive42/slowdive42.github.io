// src/chat.js
const chatLog   = document.getElementById('chatLog');
const chatForm  = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');

// ---------- UI helpers ----------
function appendMessage(text, sender = 'bot') {
  const div = document.createElement('div');
  div.className = `message ${sender}`;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;          // always scroll to bottom
}

function resizeTextarea() {
  userInput.style.height = 'auto';
  userInput.style.height = userInput.scrollHeight + 'px';
}

userInput.addEventListener('input', resizeTextarea);

if (!res.ok) {
  const errData = await res.json();
  placeholder.textContent = `❌ 错误 ${res.status}: ${errData.error?.message || '请求失败'}`;
  return;
}


// ---------- Chat ----------
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;

  appendMessage(question, 'user');
  userInput.value = '';
  resizeTextarea();

  // placeholder while waiting
  appendMessage('…', 'bot');
  const placeholder = chatLog.lastElementChild;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.OPENAI_API_KEY}`   // 来自 config.js
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',        // 想省钱就换 gpt-3.5-turbo
        temperature: 0.7,
        max_tokens: 512,
        messages: [
          {
            role: 'system',
            content: `You are Nathan, a seasoned quantitative researcher.
Answer questions about your background, projects, and career in a friendly,
concise tone. If the user asks about something else, politely decline.`
          },
          { role: 'user', content: question }
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
