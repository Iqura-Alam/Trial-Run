const form = document.getElementById('filterForm');
const listingsDiv = document.getElementById('listings');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const query = new URLSearchParams(new FormData(form)).toString();

  try {
    const res = await fetch(`http://localhost:3000/api/listings?${query}`);
    const listings = await res.json();

    listingsDiv.innerHTML = '';

    if (listings.length === 0) {
      listingsDiv.innerHTML = '<p>No listings found.</p>';
      return;
    }

    listings.forEach(listing => {
      const card = document.createElement('div');
      card.style.border = '1px solid #ccc';
      card.style.margin = '10px';
      card.style.padding = '10px';
      card.innerHTML = `
        <h3>${listing.title}</h3>
        <p>${listing.description}</p>
        <p><strong>Category:</strong> ${listing.category}</p>
        <p><strong>Price:</strong> ৳${listing.price}</p>
        <p><strong>University:</strong> ${listing.university}</p>
      `;
      listingsDiv.appendChild(card);
    });
  } catch (err) {
    listingsDiv.innerHTML = '<p>Error loading listings.</p>';
  }
});
