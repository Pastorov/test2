// Funkcja pobierająca dane o pojazdach z API i wyświetlająca je jako markery na mapie
function fetchAndDisplayVehicleMarkers() {
    const apiUrl = 'https://www.zditm.szczecin.pl/api/v1/vehicles'; // URL do API, z którego pobierane są dane o pojazdach

    axios.get(apiUrl) // Wykonuje żądanie HTTP GET do podanego URL
        .then(response => { // Obsługuje odpowiedź od API
            const vehicles = response.data.data; // Przechowuje dane o pojazdach z odpowiedzi API

            // Usuwa wszystkie obecne markery z mapy
            markers.forEach(marker => {
                marker.setMap(null);
            });
            markers = []; // Czyści tablicę markerów

            // Iteruje po każdym pojeździe i tworzy dla niego marker na mapie
            vehicles.forEach(vehicle => {
                const marker = new google.maps.Marker({ // Tworzy nowy marker
                    position: { // Ustawia pozycję markera na podstawie danych pojazdu
                        lat: vehicle.latitude,
                        lng: vehicle.longitude
                    },
                    map: map, // Dodaje marker do mapy
                    title: vehicle.vehicle_number, // Ustawia tytuł markera (np. numer pojazdu)
                    icon: { // Definiuje ikonę markera
                        url: 'tramwaj_grafika.png', // Ścieżka do obrazka ikony
                        scaledSize: new google.maps.Size(30, 36) // Skaluje rozmiar ikony
                    }
                });

                // Dodaje słuchacza zdarzeń do markera, aby otwierał okno informacyjne po kliknięciu
                marker.addListener('click', () => {
                    const infowindow = new google.maps.InfoWindow({
                        content: `<strong>Numer linii:</strong> ${vehicle.line_number}<br/><strong>Kierunek:</strong> ${vehicle.direction} <br><strong>Prędkość:</strong> ${vehicle.velocity} km/h`
                    });
                    infowindow.open(map, marker);
                });

                markers.push(marker); // Dodaje marker do tablicy markerów
            });
        })
        .catch(error => { // Obsługuje błąd w przypadku problemów z żądaniem HTTP
            console.error('Błąd pobierania danych o pojazdach:', error);
        });
}

// Funkcja do cyklicznego odświeżania markerów pojazdów na mapie
function startRefreshingVehicleMarkers() {
    // Sprawdza, czy zakładka trasy nie jest aktywna
    if (!isRouteTabActive) {
        fetchAndDisplayVehicleMarkers(); // Pobiera i wyświetla markery pojazdów od razu
    }
    // Ustawia interwał do cyklicznego odświeżania markerów pojazdów co 15 sekund
    setInterval(() => {
        if (!isRouteTabActive) { // Ponownie sprawdza, czy zakładka trasy nie jest aktywna
            fetchAndDisplayVehicleMarkers(); // Pobiera i wyświetla markery pojazdów
        }
    }, 15000); // Czas odświeżania ustawiony na 15 sekund
}
