const map = L.map('map').setView([12.9716, 77.5946], 17); // Replace with your campus coords

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let marker = null;
let selectedPos = null;

map.on('click', function (e) {
  if (marker) map.removeLayer(marker);

  selectedPos = e.latlng;
  marker = L.marker(selectedPos).addTo(map)
    .bindPopup('Meetup here').openPopup();
});

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
