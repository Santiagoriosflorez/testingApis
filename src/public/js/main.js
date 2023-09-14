// Crear un mapa Leaflet y configurarlo con una vista inicial
const map = L.map('map-template').setView([4.72094, -74.07525], 10);

// Iniciamos socket 
const socket = io();

// Agregamos el mapa de OpenStreetMap 
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Crear la ruta y agregarla al mapa
const routeLayer = L.layerGroup().addTo(map);

// Iniciar la ubicación del usuario 
map.locate({ enableHighAccuracy: true });

// Función para configurar el OpenRouteService
function getRouteDirections(start, end) {
    const apiKey = '5b3ce3597851110001cf6248a1bdfcc7d99f494091e3d5e9c94f1bb6';
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start}&end=${end}`;

    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error al obtener direcciones:', error);
        });
}

// Escuchar el evento de ubicación encontrada en el mapa
map.on('locationfound', e => {
    // Obtener las coordenadas del usuario
    const coordenadasUsuario = [e.latlng.lat, e.latlng.lng];

    // Crear un marcador en la ubicación del usuario con un mensaje emergente
    const userMarker = L.marker(coordenadasUsuario).bindPopup('¡Estás aquí!');
    map.addLayer(userMarker);

    const coordenadasOtraPersona = [4.61254, -74.20040];

      // Solicitar direcciones de la ruta
      getRouteDirections(`${coordenadasUsuario[1]},${coordenadasUsuario[0]}`, `${coordenadasOtraPersona[1]},${coordenadasOtraPersona[0]}`)
      .then(data => {
          // Crear la ruta después de obtener las direcciones
          const route = L.polyline(data.features[0].geometry.coordinates, { color: 'blue' }).addTo(routeLayer);
          
          // Crear un marcador y un mensaje emergente
          const marcadorOtraPersona = L.marker(coordenadasOtraPersona).bindPopup('¡Aquí está el marcador de la otra persona!');
          
          // Agregar el marcador de la otra persona a la capa de la ruta
          routeLayer.addLayer(marcadorOtraPersona);
          
          // Actualizar la capa de la ruta con las coordenadas del usuario y la otra persona
          route.setLatLngs([coordenadasUsuario, coordenadasOtraPersona]);
          
          // Centrar el mapa en la nueva ruta
          const limites = route.getBounds();
          map.fitBounds(limites);
      });
});

  

