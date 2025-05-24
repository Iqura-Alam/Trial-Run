const universitySelect = document.getElementById('university');
const domainSpan = document.getElementById('domain');
const form = document.getElementById('registerForm');
const messageDiv = document.getElementById('message');

let currentDomain = '';

universitySelect.addEventListener('change', () => {
  const selected = universitySelect.options[universitySelect.selectedIndex];
  currentDomain = selected.dataset.domain || '';
  domainSpan.textContent = '@' + currentDomain;
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailLocal = document.getElementById('emailLocal').value.trim();
  const name = document.getElementById('name').value.trim();

  if (!currentDomain) {
    showMessage("Please select a university first!", "error");
    return;
  }

  const fullEmail = `${emailLocal}@${currentDomain}`;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.email = fullEmail;

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      showMessage(`🎉 Welcome, ${name}! Check your email (${fullEmail}) to verify your account.`, 'success');
      form.reset();
      domainSpan.textContent = '@domain.edu';
    } else {
      showMessage(result.message || 'Registration failed.', 'error');
    }
  } catch (err) {
    showMessage('❌ Server error. Please try again later.', 'error');
  }
});

function showMessage(msg, type) {
  messageDiv.textContent = msg;
  messageDiv.style.color = type === 'success' ? 'green' : 'red';
}
