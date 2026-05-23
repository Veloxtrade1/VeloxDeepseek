const token = localStorage.getItem('token');
async function loadKeys() {
  const res = await fetch('/api/api-keys', { headers: { 'x-auth-token': token } });
  const keys = await res.json();
  const list = document.getElementById('apiKeysList');
  if (list) list.innerHTML = keys.map(k => `<li>${k.name} - ${k.key} <button onclick="deleteKey('${k._id}')">Delete</button></li>`).join('');
}
document.getElementById('apiKeyForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('keyName').value;
  const permissions = ['trade','read'];
  const res = await fetch('/api/api-keys', { method:'POST', headers:{'Content-Type':'application/json','x-auth-token':token}, body:JSON.stringify({name,permissions}) });
  const data = await res.json();
  alert(`Key: ${data.key}\nSecret: ${data.secret}\nSave this securely.`);
  loadKeys();
});
window.deleteKey = async (id) => {
  await fetch(`/api/api-keys/${id}`, { method:'DELETE', headers:{'x-auth-token':token} });
  loadKeys();
};
loadKeys();