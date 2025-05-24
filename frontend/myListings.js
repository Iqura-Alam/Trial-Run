const container = document.getElementById('listingsContainer');
const token = localStorage.getItem('token');

async function fetchMyListings() {
  const res = await fetch('http://localhost:3000/api/listings/my-listings', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const listings = await res.json();
  container.innerHTML = listings.map(l => `
    <div class="my-listing-card">
      <h3>${l.title}</h3>
      <p>${l.description}</p>
      <div class="status-container">
        <span class="status-label ${l.status === 'Available' ? 'available' : 'sold'}">${l.status}</span>
        ${l.status === 'Available' ? `<button class="mark-sold-btn" onclick="markAsSold('${l._id}')">Mark as Sold</button>` : ''}
      </div>
    </div>
  `).join('');
}

async function markAsSold(id) {
  const res = await fetch(`http://localhost:3000/api/listings/${id}/mark-sold`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await res.json();
  if (res.ok) {
    alert("Marked as sold!");
    fetchMyListings(); // refresh
  } else {
    alert(result.error || "Failed to mark as sold.");
  }
}

fetchMyListings();
