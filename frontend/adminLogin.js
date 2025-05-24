document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;

  const res = await fetch('/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (res.ok) {
    window.location.href = 'admin.html';
  } else {
    alert('Invalid credentials');
  }
});
