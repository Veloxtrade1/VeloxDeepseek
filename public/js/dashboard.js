const token = localStorage.getItem('token');
if (!token) window.location.href = '/';
(async () => {
  const res = await fetch('/api/account/me', { headers: { 'x-auth-token': token } });
  const user = await res.json();
  const emailSpan = document.getElementById('userEmail');
  const balanceSpan = document.getElementById('balance');
  if (emailSpan) emailSpan.innerText = user.email;
  if (balanceSpan) balanceSpan.innerText = user.balance.toFixed(2);
  if (document.getElementById('positionsList')) {
    const posRes = await fetch('/api/account/positions', { headers: { 'x-auth-token': token } });
    const positions = await posRes.json();
    document.getElementById('positionsList').innerHTML = positions.map(p => `<li>${p.symbol} | ${p.quantity} lots @ ${p.avgPrice}</li>`).join('');
    const ordRes = await fetch('/api/account/orders', { headers: { 'x-auth-token': token } });
    const orders = await ordRes.json();
    document.getElementById('ordersList').innerHTML = orders.slice(0,5).map(o => `<li>${o.side.toUpperCase()} ${o.quantity} ${o.symbol} @ ${o.price}</li>`).join('');
  }
})();
document.getElementById('logoutBtn')?.addEventListener('click', () => { localStorage.removeItem('token'); window.location.href = '/'; });
document.getElementById('btcMethod')?.addEventListener('click', async () => {
  const res = await fetch('/api/account/deposit-address', { headers: { 'x-auth-token': token } });
  const data = await res.json();
  document.getElementById('depositAddress').innerText = data.btc;
  document.getElementById('qrCode').src = data.btcQR;
  document.getElementById('depositModal').style.display = 'flex';
});
window.copyText = (id) => { const text = document.getElementById(id).innerText; navigator.clipboard.writeText(text); alert('Copied'); };
window.closeModal = () => document.getElementById('depositModal').style.display = 'none';
document.getElementById('withdrawForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const amount = document.getElementById('withdrawAmount').value;
  const address = document.getElementById('withdrawAddress').value;
  const currency = document.getElementById('withdrawCurrency').value;
  const res = await fetch('/api/account/withdraw', { method:'POST', headers:{'Content-Type':'application/json','x-auth-token':token}, body:JSON.stringify({amount,address,currency}) });
  const data = await res.json();
  alert(data.msg);
  if (data.balance) document.getElementById('balance').innerText = data.balance;
});
document.getElementById('kycForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const res = await fetch('/api/kyc/submit', { method:'POST', headers:{'x-auth-token':token}, body:formData });
  const data = await res.json();
  alert(data.msg);
});