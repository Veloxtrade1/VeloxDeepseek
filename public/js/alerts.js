const token = localStorage.getItem('token');
async function loadAlerts() {
  const res = await fetch('/api/alerts', { headers: { 'x-auth-token': token } });
  const alerts = await res.json();
  const list = document.getElementById('alertsList');
  if (list) list.innerHTML = alerts.map(a => `<li>${a.symbol} ${a.condition} ${a.price} <button onclick="deleteAlert('${a._id}')">Delete</button></li>`).join('');
}
document.getElementById('alertForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const symbol = document.getElementById('alertSymbol').value;
  const condition = document.getElementById('alertCondition').value;
  const price = parseFloat(document.getElementById('alertPrice').value);
  await fetch('/api/alerts', { method:'POST', headers:{'Content-Type':'application/json','x-auth-token':token}, body:JSON.stringify({symbol,condition,price}) });
  loadAlerts();
});
window.deleteAlert = async (id) => {
  await fetch(`/api/alerts/${id}`, { method:'DELETE', headers:{'x-auth-token':token} });
  loadAlerts();
};
loadAlerts();