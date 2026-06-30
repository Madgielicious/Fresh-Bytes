let map, directionsService, directionsRenderer, geocoder;

function initMap() {
    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: 14.4297, lng: 120.9348 } // Default: Cavite area
    });
    directionsRenderer.setMap(map);
}

async function findNearestOffice() {
    const address = document.getElementById('addressInput').value;
    const service = document.getElementById('serviceSelect').value;
    const errorDiv = document.getElementById('error-msg');
    
    errorDiv.innerText = "";
    
    if (!address || !service) {
        errorDiv.innerText = "Please enter an address and select a service.";
        return;
    }

    // 1. Geocode User Address
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
            const userLocation = results[0].geometry.location;
            
            // 2. Search for nearby places using Places API
            const serviceObj = new google.maps.places.PlacesService(map);
            serviceObj.textSearch({
                query: service,
                location: userLocation,
                radius: 5000
            }, (places, status) => {
                if (status === 'OK' && places.length > 0) {
                    const nearest = places[0]; // Simplification: First result is assumed nearest
                    displayResult(nearest, userLocation);
                } else {
                    errorDiv.innerText = "No nearby office found. Please try another location.";
                }
            });
        } else {
            errorDiv.innerText = "Invalid address. Please try again.";
        }
    });
}

function displayResult(place, userLoc) {
    const card = document.getElementById('result-card');
    card.classList.remove('hidden');
    card.innerHTML = `
        <h3>${place.name}</h3>
        <p>${place.formatted_address}</p>
        <button onclick="getDirections('${place.formatted_address}')">Get Directions</button>
    `;
    
    new google.maps.Marker({ map, position: place.geometry.location });
}

function getDirections(destination) {
    const origin = document.getElementById('addressInput').value;
    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING'
    }, (response, status) => {
        if (status === 'OK') directionsRenderer.setDirections(response);
    });
}

window.onload = initMap;
