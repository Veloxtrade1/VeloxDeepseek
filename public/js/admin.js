const adminKey = localStorage.getItem('adminKey');
if (!adminKey) { const key = prompt('Enter admin key:'); if (key) localStorage.setItem('adminKey', key); else window.location.href = '/'; }
const headers = { 'admin-key': localStorage.getItem('adminKey') };
async function loadDashboard() {
  const usersRes = await fetch('/api/admin/users', { headers }); const users = await usersRes.json();
  document.getElementById('totalUsers').innerText = users.length;
  const depositsRes = await fetch('/api/admin/deposits', { headers }); const deposits = await depositsRes.json();
  const total = deposits.reduce((s,d)=>s+d.amount,0);
  document.getElementById('totalDeposits').innerText = total;
  const kycRes = await fetch('/api/admin/kyc', { headers }); const kycs = await kycRes.json();
  document.getElementById('pendingKyc').innerText = kycs.length;
}
async function loadUsers() {
  const res = await fetch('/api/admin/users', { headers }); const users = await res.json();
  const tbody = document.querySelector('#usersTable tbody');
  if (tbody) tbody.innerHTML = users.map(u => `<tr><td>${u.email}</td><td>${u.fullName||'-'}</td><td>${u.country}</td><td>$${u.balance}</td><td>${u.kycStatus}</td><td><button onclick="editUser('${u._id}')" class="btn-sm">Edit</button></td></tr>`).join('');
}
async function loadDeposits() {
  const res = await fetch('/api/admin/deposits', { headers }); const deposits = await res.json();
  const container = document.getElementById('pendingDepositsList');
  if (container) container.innerHTML = deposits.map(d => `<tr><td>${d.userId.email}</td><td>$${d.amount}</td><td>${d.txHash}</td><td><button onclick="confirmDeposit('${d._id}')" class="btn-sm">Confirm</button></td></tr>`).join('');
}
async function loadKyc() {
  const res = await fetch('/api/admin/kyc', { headers }); const kycs = await res.json();
  const container = document.getElementById('kycList');
  if (container) container.innerHTML = kycs.map(k => `<div class="kyc-card"><p><strong>${k.fullName}</strong> (${k.userId.email})</p><p>ID: ${k.idNumber}</p><button onclick="approveKyc('${k._id}')" class="btn-sm">Approve</button> <button onclick="rejectKyc('${k._id}')" class="btn-sm">Reject</button></div>`).join('');
}
window.confirmDeposit = async (id) => { await fetch(`/api/admin/confirm-deposit/${id}`, { method:'POST', headers }); alert('Confirmed'); location.reload(); };
window.approveKyc = async (id) => { await fetch(`/api/admin/kyc/${id}`, { method:'POST', headers:{...headers,'Content-Type':'application/json'}, body:JSON.stringify({status:'approved',comment:'Verified'}) }); alert('Approved'); location.reload(); };
window.rejectKyc = async (id) => { const comment = prompt('Reason:'); if(comment) await fetch(`/api/admin/kyc/${id}`, { method:'POST', headers:{...headers,'Content-Type':'application/json'}, body:JSON.stringify({status:'rejected',comment}) }); location.reload(); };
if (window.location.pathname.includes('/admin/index')) loadDashboard();
if (window.location.pathname.includes('/admin/users')) loadUsers();
if (window.location.pathname.includes('/admin/deposits')) loadDeposits();
if (window.location.pathname.includes('/admin/kyc')) loadKyc();