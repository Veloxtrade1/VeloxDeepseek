const token = localStorage.getItem('token');
document.getElementById('enable2fa')?.addEventListener('click', async () => {
  const res = await fetch('/api/2fa/enable', { headers: { 'x-auth-token': token } });
  const data = await res.json();
  document.getElementById('qrCodeContainer').innerHTML = `<img src="${data.qr}"><p>Secret: ${data.secret}</p>`;
  document.getElementById('verify2faForm').style.display = 'block';
});
document.getElementById('verify2faForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const token2fa = document.getElementById('2faToken').value;
  await fetch('/api/2fa/verify', { method:'POST', headers:{'Content-Type':'application/json','x-auth-token':token}, body:JSON.stringify({token:token2fa}) });
  alert('2FA enabled');
});