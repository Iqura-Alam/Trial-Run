window.onload = async () => {
  const res = await fetch('/admin/users');
  const users = await res.json();

  const container = document.getElementById('usersContainer');
  users.forEach(user => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>${user.name}</strong> (${user.email}) - Suspended: ${user.suspended}</p>
      <p>Bought: ${user.bought.join(', ') || 'None'}</p>
      <p>Sold: ${user.sold.join(', ') || 'None'}</p>
      <button onclick="toggleSuspend('${user._id}', ${user.suspended})">
        ${user.suspended ? 'Unsuspend' : 'Suspend'}
      </button>
      <hr/>
    `;
    container.appendChild(div);
  });
};

async function toggleSuspend(userId, currentlySuspended) {
  const endpoint = currentlySuspended ? 'unsuspend' : 'suspend';
  const res = await fetch(`/admin/${endpoint}/${userId}`, { method: 'POST' });

  if (res.ok) {
    alert(`User ${currentlySuspended ? 'unsuspended' : 'suspended'}`);
    window.location.reload();
  } else {
    alert('Action failed');
  }
}
