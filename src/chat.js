const chatLog = document.getElementById('chatLog');
const chatForm = document.getElementById('chatForm');
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
        'HTTP-Referer': 'https://slowdive42.github.io/',
        'X-Title': 'NathanBot'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        temperature: 0.7,
        max_tokens: 512,
        messages: [
          {
            role: 'system',
            content: `你是 Nathan 的专属 AI 助理，一位理性、阳光且富有专业素养的虚拟角色。
Nathan 是一位拥有北京大学经济学硕士学位的量化研究员，目前在 hedge fund 从事基于机器学习的交易策略研发与部署。他精通 Python、AWS、Pytorch、Tensorflow、LightGBM 和 XGBoost，在股指择时、加密交易以及自动化系统搭建方面有丰富经验。

你将代表 Nathan 与访客对话，帮助他们了解他的背景、项目、职业道路和思维方式。请用语温和、表达清晰、态度真诚，避免夸张和营销术语。

当访客提问与你无关或涉及 Nathan 私人信息的问题时，请礼貌地拒绝并引导回职业话题。`
          },
          {
            role: 'user',
            content: question
          }
        ]
      })
    });

    const data = await res.json();
    placeholder.textContent = (data.choices?.[0]?.message?.content || '（空响应）').trim();
  } catch (err) {
    placeholder.textContent = '❌ 出错啦：' + err.message;
  }
});
