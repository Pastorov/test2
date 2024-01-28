// Tworzy markery na mapie Google Maps na podstawie przekazanej listy lokalizacji
function createMarkers(locations) {
    const tempMarkers = []; // Tymczasowa tablica do przechowywania markerów

    // Iteracja po każdej lokalizacji z listy
    locations.forEach(location => {
        // Tworzenie nowego markera dla każdej lokalizacji
        const marker = new google.maps.Marker({
            position: new google.maps.LatLng(location.latitude, location.longitude), // Ustawienie pozycji markera
            title: location.name, // Tytuł markera (np. nazwa przystanku)
            map: map, // Dodanie markera do mapy
            icon: { // Ustawienie niestandardowej ikony dla markera
                url: 'przystanek_grafika.png', // Ścieżka do obrazka ikony
                scaledSize: new google.maps.Size(30, 50) // Skalowanie ikony
            }
        });

        // Dodanie słuchacza zdarzeń do markera, aby wyświetlał informacje po kliknięciu
        marker.addListener('click', () => {
            // Wykonanie żądania GET do API w celu pobrania informacji o odjazdach dla danej lokalizacji
            axios.get(`https://www.zditm.szczecin.pl/api/v1/displays/${location.number}`) 
                .then(response => {
                    const data = response.data; // Przechowywanie odpowiedzi z API
                    let departuresInfo = ''; // Inicjalizacja zmiennej do przechowywania informacji o odjazdach

                    // Tworzenie łańcucha HTML z informacjami o pierwszych 5 odjazdach
                    data.departures.slice(0, 5).forEach(dep => {
                        let departureTime = dep.time_real !== null ?
                            dep.time_real + ' min' : // Czas rzeczywisty, jeśli dostępny
                            (dep.time_scheduled !== null ? dep.time_scheduled : 'n/a'); // Czas zaplanowany, jeśli czas rzeczywisty nie jest dostępny
                        departuresInfo += `<tr style="color: #faa702;">
      <td style="padding-right: 20px;">${dep.line_number}</td>
      <td style="padding-right: 60px; white-space: nowrap;">${dep.direction}</td>
      <td>${departureTime}</td>
    </tr>`;
                    });

                    // Utworzenie nowego obiektu Date reprezentującego bieżącą datę i czas
                    const teraz = new Date();
                    // Pobranie bieżącej godziny, konwersja na łańcuch znaków i dodanie zera na początku jeśli jest to konieczne, aby zapewnić format dwucyfrowy
                    const formattedTime = teraz.getHours().toString().padStart(2, '0') + ':' + teraz.getMinutes().toString().padStart(2, '0');

                    // Tworzenie zawartości okna informacyjnego z informacjami o odjazdach
                    const infowindowContent = `<div class="infoWindow-background">
              <h6>${data.stop_name} (${data.stop_number}) <span style="margin-left: 50px; color:#faa702 ">${formattedTime}</span></h6>
              <div style="margin-top: 35px;"></div> 
              <table class="infoWindow-table">
                ${departuresInfo}
              </table>
            </div>`;

                    // Tworzenie i wyświetlanie okna informacyjnego po kliknięciu na marker
                    const infowindow = new google.maps.InfoWindow({
                        content: infowindowContent
                    });
                    infowindow.open(map, marker);
                })
                .catch(error => {
                    console.error('Błąd pobierania danych:', error); // Logowanie błędu, jeśli żądanie zakończy się niepowodzeniem
                });
        });

        tempMarkers.push(marker); // Dodanie markera do tymczasowej tablicy
    });

    // Użycie MarkerClusterer do grupowania markerów, gdy są zbyt blisko siebie
    new MarkerClusterer(map, tempMarkers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });
}

// Pobiera dane o przystankach z API i wyświetla je jako markery na mapie
function fetchAndDisplayMarkers() {
    const apiUrl = 'https://www.zditm.szczecin.pl/api/v1/stops'; // URL do API z danymi o przystankach

    axios.get(apiUrl) // Wykonanie żądania HTTP GET do API
        .then(response => {
            const locations = response.data.data; // Przechowywanie odpowiedzi z API
            createMarkers(locations); // Wywołanie funkcji createMarkers z danymi o lokalizacjach
        })
        .catch(error => {
            console.error('Błąd pobierania danych:', error); // Logowanie błędu, jeśli żądanie zakończy się niepowodzeniem
        });
}
