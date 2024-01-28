// Funkcja umożliwiająca powrót do panelu wyszukiwania z panelu kierunków
function goBack() {
    // Ukrywa panel z kierunkami i pokazuje panel wyszukiwania
    document.getElementById('directionsPanel').style.display = 'none';
    document.getElementById('searchPanel').style.display = 'block';
    // Ukrywa przycisk powrotu
    document.getElementById('backButton').style.display = 'none';

    // Czyści wyświetlane wcześniej trasy, jeśli istnieje instancja DirectionsRenderer
    if (directionsRenderer) {
        directionsRenderer.setDirections({
            routes: [] // Ustawia puste trasy, efektywnie czyści mapę z wcześniej wyświetlanych tras
        });
    }
    // Pokazuje zakładki, jeśli są ukryte
    const tabsDiv = document.getElementById('tabs');
    if (tabsDiv) {
        tabsDiv.style.display = 'flex';
    }
}

// Funkcja przełączająca między zakładkami w aplikacji
function switchTab(tabName) {
    // Jeśli wybrano zakładkę 'Trasa', usuwa wszystkie linie z mapy i resetuje mapę
    if (tabName === 'route') {
        mapLines.forEach(line => line.setMap(null)); // Usuwa linie
        isRouteTabActive = true; // Ustawia flagę aktywnej zakładki trasy
        mapLines = []; // Czyści tablicę linii
        initMap(); // Inicjalizuje mapę na nowo
    } else {
        isRouteTabActive = false; // Ustawia flagę aktywnej zakładki trasy na false, jeśli wybrana jest inna zakładka
    }

    // Zarządza widocznością paneli w zależności od wybranej zakładki
    document.getElementById('directionsPanel').style.display = tabName === 'route' ? 'block' : 'none';
    document.getElementById('schedulesPanel').style.display = tabName === 'schedules' ? 'block' : 'none';
    document.getElementById('optionsPanel').style.display = tabName === 'options' ? 'block' : 'none';
    document.getElementById('searchPanel').style.display = tabName === 'route' ? 'block' : 'none';

    // Aktualizuje styl zakładek, wskazując, która z nich jest aktualnie aktywna
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        if (tab.textContent === 'Trasa' && tabName === 'route') {
            tab.classList.add('active');
        } else if (tab.textContent === 'Linie' && tabName === 'schedules') {
            startRefreshingVehicleMarkers(); // Rozpoczyna odświeżanie markerów pojazdów
            fetchAndDisplayMarkers(); // Pobiera i wyświetla markery
            tab.classList.add('active');
        } else if (tab.textContent === 'Opcje' && tabName === 'options') {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Funkcja wyświetlająca panel kierunków i ukrywająca panel wyszukiwania
function showDirectionsPanel() {
    document.getElementById('searchPanel').style.display = 'none'; // Ukrywa panel wyszukiwania
    document.getElementById('directionsPanel').style.display = 'block'; // Pokazuje panel kierunków
}