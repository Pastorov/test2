// Inicjalizuje mapę Google Maps wraz z potrzebnymi usługami i ustawieniami
function initMap() {
    // Inicjalizacja niezbędnych usług Google Maps
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder();

    // Ustawienie początkowej lokalizacji mapy na Szczecin
    const szczecin = { lat: 53.4285, lng: 14.5528 };

    // Definicja stylów mapy, ukrywających niepotrzebne poi
    const mapStyles = [
        // Ukrywa atrakcje turystyczne
        { featureType: "poi.attraction", stylers: [{ visibility: "off" }] },
        // Ukrywa miejsca kultu religijnego
        { featureType: "poi.place_of_worship", stylers: [{ visibility: "off" }] },
        // Ukrywa placówki medyczne
        { featureType: "poi.medical", stylers: [{ visibility: "off" }] },
        // Ukrywa parki
        { featureType: "poi.park", stylers: [{ visibility: "off" }] },
        // Ukrywa biznesy
        { featureType: "poi.business", stylers: [{ visibility: "off" }] },
        // Ukrywa kompleksy sportowe
        { featureType: "poi.sports_complex", stylers: [{ visibility: "off" }] },
        // Ukrywa budynki rządowe
        { featureType: "poi.government", stylers: [{ visibility: "off" }] },
        // Ukrywa szkoły
        { featureType: "poi.school", stylers: [{ visibility: "off" }] },
        // Ukrywa lotniska
        { featureType: "transit.station.airport", stylers: [{ visibility: "off" }] }
    ];

    // Tworzenie nowego obiektu mapy z zastosowaniem zdefiniowanych stylów i ustawień
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13, // Ustawia początkowy poziom powiększenia mapy
        center: szczecin, // Centruje mapę na Szczecinie
        styles: mapStyles, // Aplikuje zdefiniowane wcześniej style mapy
        // Wyłączenie niepotrzebnych kontrolek mapy dla uproszczenia interfejsu
        streetViewControl: false, // Wyłącza kontrolkę Street View
        fullscreenControl: false, // Wyłącza kontrolkę pełnoekranową
        mapTypeControl: false // Wyłącza kontrolkę zmiany typu mapy
    });

    // Ustawienie renderera tras na mapie oraz przypisanie panelu do wyświetlania wskazówek trasy
    directionsRenderer.setMap(map); // Umożliwia wyświetlanie wyznaczonej trasy na mapie
    directionsRenderer.setPanel(document.getElementById("directionsPanel")); // Ustawia panel do wyświetlania wskazówek trasy

    // Wywołanie funkcji do ustawienia bieżącego czasu i inicjalizacji autouzupełniania
    setCurrentTime(); // Ustawia bieżący czas w odpowiednim polu
    initAutocomplete(); // Inicjalizuje funkcję autouzupełniania dla pól adresowych

    // Dodanie słuchacza zdarzeń do ikony użytkownika, otwierającego panel logowania
    const userIcon = document.getElementById("userIcon"); // Uzyskuje dostęp do ikony użytkownika
    userIcon.addEventListener("click", showLoginPanel); // Dodaje słuchacz zdarzeń, aby pokazać panel logowania po kliknięciu na ikonę użytkownika
}


// Inicjalizuje autouzupełnianie adresów w polach wprowadzania lokalizacji
function initAutocomplete() {
    // Uzyskanie dostępu do elementów DOM dla pól startowego i końcowego
    const startInput = document.getElementById("start");
    const endInput = document.getElementById("end");

    // Opcje konfiguracyjne dla autouzupełniania, ograniczenie do Polski
    const autocompleteOptions = {
        bounds: userLocationBounds, // Ogranicza wyniki do obszaru określonego przez userLocationBounds
        componentRestrictions: { country: 'pl' },
        fields: ['address_components', 'geometry', 'name'], // Określa, które informacje mają być zwracane
    };

    // Tworzenie nowych obiektów autouzupełniania dla obu pól
    new google.maps.places.Autocomplete(startInput, autocompleteOptions);
    new google.maps.places.Autocomplete(endInput, autocompleteOptions);
}

// Używa geolokalizacji użytkownika do ustawienia aktualnej lokalizacji jako punktu startowego
function useCurrentLocation() {
    // Sprawdza, czy przeglądarka wspiera geolokalizację
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            // Ustawia aktualną pozycję na podstawie danych z geolokalizacji
            const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
            // Tworzy nowy obiekt LatLngBounds do późniejszego użycia w autouzupełnianiu
            userLocationBounds = new google.maps.LatLngBounds();
            userLocationBounds.extend(pos);

            // Używa geokodera do znalezienia czytelnej dla człowieka formy adresu na podstawie współrzędnych
            geocoder.geocode({ 'location': pos }, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        // Ustawia znaleziony adres jako wartość w polu startowym
                        document.getElementById("start").value = results[0].formatted_address;
                        // Dodaje marker na mapie wskazujący aktualną lokalizację
                        new google.maps.Marker({
                            position: pos,
                            map: map,
                            title: "Twoja aktualna lokalizacja"
                        });
                        // Centruje mapę na aktualnej lokalizacji
                        map.setCenter(pos);
                        // Ponownie inicjalizuje autouzupełnianie, aby uwzględnić nowe ograniczenia
                        initAutocomplete();
                    } else {
                        window.alert('Nie znaleziono adresów.');
                    }
                } else {
                    window.alert('Geocoder nie powiódł się z powodu: ' + status);
                }
            });
        }, () => {
            window.alert('Błąd: Usługa geolokalizacji nie powiodła się.');
        });
    } else {
        window.alert('Błąd: Twoja przeglądarka nie wspiera geolokalizacji.');
    }
}
