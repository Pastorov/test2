// Ustawia bieżący czas jako wartość elementu input dla czasu wyjazdu
function setCurrentTime() {
    const currentTime = new Date(); // Pobiera bieżący czas
    // Konwertuje godziny i minuty na łańcuchy znaków, dodając wiodące zera, jeśli są potrzebne
    let hours = currentTime.getHours().toString().padStart(2, '0');
    let minutes = currentTime.getMinutes().toString().padStart(2, '0');
    // Ustawia wartość elementu input dla czasu wyjazdu na sformatowany czas
    document.getElementById('departureTime').value = hours + ':' + minutes;
}
// Wywołuje funkcję setCurrentTime co 10 sekund, aby aktualizować czas wyjazdu
setInterval(setCurrentTime, 10000);

// Zwraca sformatowany bieżący czas jako łańcuch znaków
function getCurrentTime() {
    const now = new Date(); // Pobiera bieżący czas
    // Zwraca sformatowany czas, używając lokalnych ustawień, do wyświetlenia godzin i minut
    return now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Aktualizuje wyświetlany czas co sekundę w podanym oknie informacyjnym
function updateCurrentTimeEverySecond(infowindow, locationNumber) {
    // Ustawia interwał, który wykonuje się co sekundę
    const intervalId = setInterval(() => {
        // Sprawdza, czy okno informacyjne jest nadal otwarte
        if (!infowindow.getMap()) {
            clearInterval(intervalId); // Jeśli nie, zatrzymuje interwał
            return;
        }
        // Pobiera element DOM, w którym ma być wyświetlany bieżący czas
        const currentTimeElement = document.getElementById('currentTime');
        if (currentTimeElement) {
            currentTimeElement.textContent = getCurrentTime(); // Ustawia tekst elementu na bieżący czas
        }
    }, 1000); // Czas odświeżania ustawiony na 1 sekundę
    infowindow.intervalId = intervalId; // Przypisuje ID interwału do okna informacyjnego, umożliwiając jego późniejsze zatrzymanie
}