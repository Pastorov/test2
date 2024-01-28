// Funkcja do pobierania danych o liniach komunikacji miejskiej z API
function fetchData() {
    axios.get('https://www.zditm.szczecin.pl/api/v1/lines') // Wykonuje żądanie HTTP GET do API
        .then(response => {
            const lines = response.data.data; // Przechowuje odpowiedź z API
            // Sortuje linie komunikacyjne rosnąco według numeru
            const sortedLines = lines.sort((a, b) => parseInt(a.number) - parseInt(b.number)); 
            displayLines(sortedLines); // Wywołuje funkcję displayLines z posortowanymi danymi
        })
        .catch(error => {
            console.error('Błąd pobierania danych:', error); // Loguje błąd w przypadku niepowodzenia żądania
        });
}

// Funkcja do rysowania wybranej linii komunikacyjnej na mapie
function drawLine(lineNumber) {
    // Usuwa wcześniej narysowane linie z mapy
    mapLines.forEach(line => line.setMap(null));
    mapLines = []; // Czyści tablicę z liniami

    // Pobiera dane o trasie wybranej linii komunikacyjnej
    axios.get(`https://www.zditm.szczecin.pl/api/v1/trajectories/${lineNumber}`)
        .then(response => {
            // Filtruje domyślne warianty trasy
            const defaultRoutes = response.data.features.filter(feature => feature.properties.route_variant_type === 'default');

            // Rysuje każdą domyślną trasę na mapie
            defaultRoutes.forEach(route => {
                const coordinates = route.geometry.coordinates; // Przechowuje współrzędne trasy
                // Konwertuje współrzędne na format wymagany przez Google Maps API
                const linePath = coordinates.map(coord => ({
                    lat: coord[1],
                    lng: coord[0]
                }));
                // Tworzy nową linię na mapie z określoną ścieżką i stylami
                const line = new google.maps.Polyline({
                    path: linePath,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });
                line.setMap(map); // Dodaje linię do mapy
                mapLines.push(line); // Zapisuje linię w tablicy
            });
        })
        .catch(error => {
            console.error('Błąd pobierania danych:', error); // Loguje błąd w przypadku niepowodzenia żądania
        });
}

// Funkcja do wyświetlania listy linii komunikacyjnych w tabeli
function displayLines(lines) {
    const tableBody = document.getElementById('linesTableBody'); // Pobiera element tbody tabeli
    let currentRow; // Zmienna do przechowywania bieżącego wiersza tabeli

    // Iteruje po każdej linii komunikacyjnej
    lines.forEach((line, index) => {
        if (index % 6 === 0) { // Tworzy nowy wiersz co 6 linii
            currentRow = document.createElement('tr');
            tableBody.appendChild(currentRow);
        }

        const cell = document.createElement('td'); // Tworzy nową komórkę tabeli
        const link = document.createElement('a'); // Tworzy link do rysowania linii na mapie
        link.href = "#";
        link.textContent = line.number; // Ustawia tekst linku na numer linii
        link.onclick = () => drawLine(line.id); // Przypisuje funkcję drawLine do zdarzenia onclick
        cell.appendChild(link); // Dodaje link do komórki tabeli
        currentRow.appendChild(cell); // Dodaje komórkę do bieżącego wiersza
    });
}
fetchData(); // Wywołuje funkcję fetchData przy ładowaniu skryptu
