document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = 'login.html';

  loadRecent();

  document.getElementById('searchBar').addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    if (query.length === 0) return loadRecent();

    const res = await fetch(`http://localhost:3000/api/listings/search?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const results = await res.json();
    if (res.ok) renderListings(results);
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });
});

function filterByCategory(category) {
  const token = localStorage.getItem('token');
  fetch(`http://localhost:3000/api/listings/category/${category}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(renderListings)
    .catch(() => alert("Failed to fetch filtered listings"));
}

async function loadRecent() {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:3000/api/listings/recent', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (res.ok) renderListings(data);
}

function renderListings(listings) {
  const container = document.getElementById('listingContainer');
  container.innerHTML = "";

  listings.forEach(listing => {
    const card = document.createElement('div');
    card.className = 'listing-card';
    card.innerHTML = `
      <h3>${listing.title}</h3>
      <p>${listing.category} • ${listing.priceType}: ${listing.price}</p>
      <p>${listing.university}</p>
      <button onclick="viewListing('${listing._id}')">View</button>
    `;
    container.appendChild(card);
  });
}

function viewListing(id) {
  window.location.href = `listing.html?id=${id}`;
}
