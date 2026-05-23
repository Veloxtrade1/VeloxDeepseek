const token = localStorage.getItem('token');
if (!token) window.location.href = '/';
const socket = io();
let currentPrice = 0;
const symbolSelect = document.getElementById('symbolSelect');
const priceSpan = document.getElementById('currentPrice');
socket.on('initPrices', (prices) => { currentPrice = prices[symbolSelect.value]; updatePriceDisplay(); });
socket.on('priceUpdate', (prices) => { if (prices[symbolSelect.value]) currentPrice = prices[symbolSelect.value]; updatePriceDisplay(); });
function updatePriceDisplay() { if (priceSpan) priceSpan.innerText = currentPrice.toFixed(5); }
symbolSelect.addEventListener('change', () => { currentPrice = currentPrices?.[symbolSelect.value] || 0; updatePriceDisplay(); });
new TradingView.widget({ symbol: "FX:EURUSD", container_id: "tradingview_chart", width: "100%", height: 500, interval: "1", timezone: "Asia/Dubai", theme: "light", style: "1", locale: "en", enable_publishing: false, studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"] });
document.getElementById('buyBtn').onclick = async () => {
  const symbol = symbolSelect.value;
  const quantity = parseFloat(document.getElementById('quantity').value);
  if (!quantity || quantity <= 0) return alert('Enter valid quantity');
  const res = await fetch('/api/trading/order', { method:'POST', headers:{'Content-Type':'application/json','x-auth-token':token}, body:JSON.stringify({symbol,side:'buy',quantity}) });
  const data = await res.json();
  alert(data.msg);
  if (data.balance) document.getElementById('balance').innerText = data.balance;
};
document.getElementById('sellBtn').onclick = async () => {
  const symbol = symbolSelect.value;
  const quantity = parseFloat(document.getElementById('quantity').value);
  if (!quantity || quantity <= 0) return alert('Enter valid quantity');
  const res = await fetch('/api/trading/order', { method:'POST', headers:{'Content-Type':'application/json','x-auth-token':token}, body:JSON.stringify({symbol,side:'sell',quantity}) });
  const data = await res.json();
  alert(data.msg);
  if (data.balance) document.getElementById('balance').innerText = data.balance;
};