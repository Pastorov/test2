// Funkcja do obliczania i wyświetlania trasy między dwoma punktami
function calculateAndDisplayRoute() {
    // Pobieranie punktów startowego i końcowego trasy oraz wybranego czasu wyjazdu
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    const departureTimeValue = document.getElementById("departureTime").value;
    const routeMode = document.getElementById("routeMode").value; // Pobieranie trybu trasy (np. optymalny, szybki)

    // Ustawienie czasu wyjazdu na bieżący czas, jeśli wartość nie jest podana
    let departureTime = new Date();
    if (departureTimeValue !== "") {
        const timeParts = departureTimeValue.split(":");
        departureTime.setHours(timeParts[0], timeParts[1], 0, 0); // Ustawienie czasu wyjazdu zgodnie z wybraną wartością
    }

    // Konfiguracja opcji tranzystowych dla Google Maps API
    let transitOptions = {
        modes: ['BUS', 'RAIL'], // Preferowane środki transportu
        routingPreference: 'FEWER_TRANSFERS', // Preferencja dla mniejszej liczby przesiadek
        departureTime: departureTime // Ustawienie czasu wyjazdu
    };

    // Modyfikacja opcji tranzystowych w przypadku wybrania szybkiego trybu trasy
    if (routeMode === 'fast') {
        transitOptions.routingPreference = 'LESS_WALKING'; // Preferencja dla mniejszej ilości chodzenia
    }

    // Wywołanie Google Maps API do obliczenia trasy z podanymi opcjami
    directionsService.route({
        origin: start, // Punkt początkowy
        destination: end, // Punkt końcowy
        travelMode: 'TRANSIT', // Tryb podróży: komunikacja miejska
        provideRouteAlternatives: true, // Prośba o alternatywne trasy
        transitOptions: transitOptions // Zastosowanie wcześniej skonfigurowanych opcji tranzystowych
    }, (response, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(response); // Wyświetlenie obliczonej trasy na mapie
            showDirectionsPanel(); // Wyświetlenie panelu z kierunkami trasy
            routeCalculated = true; // Oznaczenie, że trasa została obliczona
            const tabsDiv = document.getElementById('tabs');
            if (tabsDiv) {
                tabsDiv.style.display = 'none'; // Ukrycie zakładek
            }
            const linesTab = document.querySelector('.tab[data-tab="schedules"]');
            if (linesTab) {
                linesTab.style.pointerEvents = 'none'; // Wyłączenie interakcji dla zakładki z rozkładami
                linesTab.style.color = '#ccc'; // Zmiana koloru zakładki na szary
            }
        } else {
            window.alert('Nie udało się wyznaczyć trasy: ' + status); // Wyświetlenie komunikatu o błędzie
        }
    });

    // Wyświetlenie przycisku powrotu
    document.getElementById('backButton').style.display = 'block';
}
