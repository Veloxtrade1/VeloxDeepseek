const socket = io();
socket.on('initPrices', (prices) => { updateTicker(prices); });
socket.on('priceUpdate', (prices) => { updateTicker(prices); });
function updateTicker(prices) {
  const container = document.getElementById('liveTicker');
  if (!container) return;
  for (const [symbol, price] of Object.entries(prices)) {
    const existing = Array.from(container.children).find(div => div.innerText.startsWith(symbol));
    if (existing) existing.innerHTML = `<span>${symbol}</span><span>${price.toFixed(5)}</span>`;
    else container.innerHTML += `<div><span>${symbol}</span><span>${price.toFixed(5)}</span></div>`;
  }
}
document.getElementById('loginBtn').onclick = async () => {
  const email = prompt('Email:'); const pwd = prompt('Password:');
  const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password:pwd}) });
  const data = await res.json();
  if (data.token) { localStorage.setItem('token',data.token); window.location.href = '/dashboard/overview'; }
  else alert('Login failed');
};
document.getElementById('signupBtn').onclick = async () => {
  const email = prompt('Email:'); const pwd = prompt('Password:'); const name = prompt('Full name:'); const country = prompt('Country (Pakistan/Bangladesh/Sri Lanka/Nepal/Bhutan/Maldives):');
  const res = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password:pwd,fullName:name,country}) });
  const data = await res.json();
  if (data.token) { localStorage.setItem('token',data.token); window.location.href = '/dashboard/overview'; }
  else alert('Registration error');
};
document.getElementById('heroSignupBtn')?.onclick = () => document.getElementById('signupBtn').click();
document.getElementById('ctaSignupBtn')?.onclick = () => document.getElementById('signupBtn').click();
document.getElementById('calcCostBtn')?.addEventListener('click', () => {
  const symbol = document.getElementById('instrumentSelect').value;
  const lots = parseFloat(document.getElementById('lotSize').value) || 0;
  const spreads = { EURUSD:0, GBPUSD:0.2, XAUUSD:0.15, BTCUSD:30 };
  let cost = spreads[symbol] * 10 * lots;
  if (symbol === 'BTCUSD') cost = spreads[symbol] * lots;
  document.getElementById('calcValue').innerText = cost.toFixed(2);
});