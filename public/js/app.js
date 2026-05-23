// Socket.IO connection with proper transport settings
const socket = io({
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5
});

// Listen for initial prices
socket.on('initPrices', (prices) => { updateTicker(prices); });

// Listen for real-time price updates
socket.on('priceUpdate', (prices) => { updateTicker(prices); });

// Function to update the live ticker on the homepage
function updateTicker(prices) {
  const container = document.getElementById('liveTicker');
  if (!container) return;
  
  for (const [symbol, price] of Object.entries(prices)) {
    const existing = Array.from(container.children).find(div => div.innerText.startsWith(symbol));
    if (existing) {
      existing.innerHTML = `<span>${symbol}</span><span>${price.toFixed(5)}</span>`;
    } else {
      container.innerHTML += `<div><span>${symbol}</span><span>${price.toFixed(5)}</span></div>`;
    }
  }
}

// Login button handler
document.getElementById('loginBtn').onclick = async () => {
  const email = prompt('Email:');
  const pwd = prompt('Password:');
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pwd })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    window.location.href = '/dashboard/overview';
  } else {
    alert('Login failed');
  }
};

// Signup button handler
document.getElementById('signupBtn').onclick = async () => {
  const email = prompt('Email:');
  const pwd = prompt('Password:');
  const name = prompt('Full name:');
  const country = prompt('Country (Pakistan/Bangladesh/Sri Lanka/Nepal/Bhutan/Maldives):');
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pwd, fullName: name, country })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    window.location.href = '/dashboard/overview';
  } else {
    alert('Registration error');
  }
};

// Hero signup button (if present)
document.getElementById('heroSignupBtn')?.onclick = () => document.getElementById('signupBtn').click();

// CTA signup button (if present)
document.getElementById('ctaSignupBtn')?.onclick = () => document.getElementById('signupBtn').click();

// Spread calculator on homepage
document.getElementById('calcCostBtn')?.addEventListener('click', () => {
  const symbol = document.getElementById('instrumentSelect').value;
  const lots = parseFloat(document.getElementById('lotSize').value) || 0;
  const spreads = { EURUSD: 0, GBPUSD: 0.2, XAUUSD: 0.15, BTCUSD: 30 };
  let cost = spreads[symbol] * 10 * lots;
  if (symbol === 'BTCUSD') cost = spreads[symbol] * lots;
  document.getElementById('calcValue').innerText = cost.toFixed(2);
});
