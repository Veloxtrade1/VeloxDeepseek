const chatDiv = document.createElement('div');
chatDiv.className = 'chat-widget';
chatDiv.innerHTML = `<div class="chat-header"><i class="fas fa-robot"></i> AI Assistant <span class="close-chat" style="float:right;cursor:pointer;">&times;</span></div><div class="chat-messages" style="height:300px;overflow-y:auto;padding:10px;"></div><input type="text" id="chatInput" placeholder="Ask me anything..." style="width:100%;padding:10px;border:none;border-top:1px solid #ddd;"></div>`;
chatDiv.style.position = 'fixed'; chatDiv.style.bottom = '20px'; chatDiv.style.right = '20px'; chatDiv.style.width = '320px'; chatDiv.style.background = 'white'; chatDiv.style.borderRadius = '16px'; chatDiv.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; chatDiv.style.zIndex = '1000'; chatDiv.style.fontFamily = 'Inter, sans-serif';
document.body.appendChild(chatDiv);
document.querySelector('.close-chat').onclick = () => chatDiv.style.display = 'none';
document.getElementById('chatInput').addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const msg = e.target.value.trim(); if (!msg) return;
    const messagesDiv = document.querySelector('.chat-messages');
    messagesDiv.innerHTML += `<div><strong>You:</strong> ${msg}</div>`;
    e.target.value = '';
    const res = await fetch('/api/chatbot/ask', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ message: msg }) });
    const data = await res.json();
    messagesDiv.innerHTML += `<div><strong>AI:</strong> ${data.reply || 'Sorry, no response'}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
});