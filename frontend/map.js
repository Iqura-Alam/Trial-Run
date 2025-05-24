const map = L.map('map').setView([12.9716, 77.5946], 17); // Replace with your campus coords

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let marker = null;
let selectedPos = null;

// 📍 Manual click on map
map.on('click', function (e) {
  if (marker) map.removeLayer(marker);

  selectedPos = e.latlng;
  marker = L.marker(selectedPos).addTo(map)
    .bindPopup('Meetup here').openPopup();
});

// ✅ Confirm meetup location
document.getElementById('confirmBtn').addEventListener('click', async () => {
  if (!selectedPos) return alert('Select a location on the map.');

  const response = await fetch('http://localhost:5000/api/meetup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: 'abc123',
      buyerId: 'user1',
      sellerId: 'user2',
      location: selectedPos
    })
  });

  const data = await response.json();
  alert('Location saved with ID: ' + data._id);
});

// 🔍 Search and pinpoint location using OpenStreetMap (Nominatim)
window.searchLocation = async function () {
  const query = document.getElementById('locationSearch').value.trim();
  if (!query) return alert('Enter a location to search');

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const results = await response.json();

    if (results.length === 0) return alert('Location not found');

    const lat = parseFloat(results[0].lat);
    const lon = parseFloat(results[0].lon);
    selectedPos = { lat, lng: lon };

    if (marker) map.removeLayer(marker);
    marker = L.marker(selectedPos).addTo(map)
      .bindPopup('Meetup here').openPopup();

    map.setView([lat, lon], 18);
  } catch (err) {
    console.error('Geocoding failed:', err);
    alert('Error searching for location');
  }
};
