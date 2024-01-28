// Funkcja sprawdzająca stan logowania użytkownika na podstawie ciasteczka
function checkLoginStatus() {
    const logCookie = getCookie("log"); // Pobiera wartość ciasteczka o nazwie "log"
    if (logCookie === "true") { // Jeśli użytkownik jest zalogowany (ciasteczko "log" ma wartość "true")
        const userIcon = document.getElementById("userIcon"); // Pobiera ikonę użytkownika
        const existingLogoutIcon = document.getElementById("logoutIcon"); // Sprawdza, czy ikona wylogowania już istnieje

        if (!existingLogoutIcon) { // Jeśli ikona wylogowania nie istnieje
            const logoutIcon = document.createElement("i"); // Tworzy nowy element ikony
            logoutIcon.id = "logoutIcon"; // Nadaje ID nowej ikonie
            logoutIcon.className = "fa-solid fa-right-from-bracket"; // Dodaje klasy CSS do ikony (Font Awesome)
            logoutIcon.onclick = logout; // Ustawia funkcję wylogowania na zdarzenie kliknięcia ikony
            logoutIcon.style.cursor = 'pointer'; // Ustawia kursor na wskaźnik, aby wskazać klikalność
            logoutIcon.style.marginLeft = "10px"; // Dodaje margines po lewej stronie ikony
            userIcon.parentNode.insertBefore(logoutIcon, userIcon.nextSibling); // Umieszcza ikonę wylogowania w DOM
        }
    }
}

// Funkcja wyświetlająca panel logowania
function showLoginPanel() {
    const logCookie = getCookie("log"); // Pobiera wartość ciasteczka "log"

    if (logCookie === "true") { // Jeśli użytkownik jest zalogowany
        alert("ZALOGOWANY"); // Wyświetla alert o zalogowaniu
    } else { // Jeśli użytkownik nie jest zalogowany
        const loginPanel = document.getElementById("loginPanel"); // Pobiera panel logowania
        const searchPanel = document.getElementById("searchPanel"); // Pobiera panel wyszukiwania
        const tabs = document.getElementById("tabs"); // Pobiera panel zakładek

        // Przełącza widoczność paneli
        if (loginPanel.style.display === "block") {
            loginPanel.style.display = "none"; 
            searchPanel.style.display = "block"; 
            tabs.style.display = "flex"; 
        } else {
            loginPanel.style.display = "block"; 
            searchPanel.style.display = "none"; 
            tabs.style.display = "none"; 
        }
    }
}

// Funkcja wylogowująca użytkownika poprzez usunięcie ciasteczka i przekierowanie
function logout() {
    // Usuwa ciasteczko "log", ustawiając datę wygaśnięcia w przeszłości
    document.cookie = "log=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = 'wyglad.html'; // Przekierowuje do strony głównej po wylogowaniu
}

// Funkcja pomocnicza do pobierania wartości ciasteczka na podstawie jego nazwy
function getCookie(name) {
    let cookieArray = document.cookie.split(';'); // Dzieli ciasteczka na tablicę par klucz=wartość
    for (let i = 0; i < cookieArray.length; i++) {
        let cookiePair = cookieArray[i].split('='); // Dzieli parę na klucz i wartość
        if (name === cookiePair[0].trim()) { // Porównuje nazwę ciasteczka z szukaną nazwą
            return cookiePair[1]; // Zwraca wartość ciasteczka, jeśli nazwa pasuje
        }
    }
    return null; // Zwraca null, jeśli ciasteczko o danej nazwie nie istnieje
}

// Ustawia funkcję sprawdzającą stan logowania do wywołania przy załadowaniu okna
window.onload = function() {
    checkLoginStatus();
}

// Funkcja przełączająca widok na panel rejestracji
function switchToRegister() {
    document.getElementById("loginPanel").style.display = "none"; // Ukrywa panel logowania
    document.getElementById("registerPanel").style.display = "block"; // Wyświetla panel rejestracji
}

// Funkcja przełączająca widok na panel logowania
function switchToLogin() {
    document.getElementById("registerPanel").style.display = "none"; // Ukrywa panel rejestracji
    document.getElementById("loginPanel").style.display = "block"; // Wyświetla panel logowania
}

// Nasłuchuje załadowania zawartości DOM, aby dodać obsługę kliknięć na linki przełączające panele
document.addEventListener("DOMContentLoaded", function() {
    // Obsługuje kliknięcie linku rejestracji, przełączając na panel rejestracji
    document.getElementById("registerLink").addEventListener("click", function(e) {
        e.preventDefault(); // Zapobiega domyślnej akcji linku
        switchToRegister(); // Wywołuje funkcję przełączającą na panel rejestracji
    });

    // Obsługuje kliknięcie linku logowania, przełączając na panel logowania
    document.getElementById("loginLink").addEventListener("click", function(e) {
        e.preventDefault(); // Zapobiega domyślnej akcji linku
        switchToLogin(); // Wywołuje funkcję przełączającą na panel logowania
    });

    checkLoginStatus(); // Sprawdza stan logowania po załadowaniu zawartości DOM
});
