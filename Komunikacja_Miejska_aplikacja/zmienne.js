let map; // Zmienna do przechowywania obiektu mapy Google Maps
let mapLines = []; // Tablica do przechowywania linii (np. ścieżek, tras) na mapie
let directionsService; // Zmienna do przechowywania instancji usługi DirectionsService Google Maps API, służącej do obliczania tras
let directionsRenderer; // Zmienna do przechowywania instancji DirectionsRenderer Google Maps API, służącej do renderowania tras na mapie
let markers = []; // Tablica do przechowywania markerów na mapie, np. lokalizacje, punkty zainteresowania
let geocoder; // Zmienna do przechowywania instancji Geocoder Google Maps API, służącej do geokodowania adresów (przekształcania adresów na współrzędne geograficzne i odwrotnie)
let routeCalculated = false; // Zmienna flagowa wskazująca, czy trasa została już obliczona (true) czy nie (false)
let isRouteTabActive = true; // Zmienna flagowa wskazująca, czy zakładka trasy jest aktywna (true) czy nie (false)
let userLocationBounds; // Zmienna do przechowywania granic obszaru obejmującego lokalizacje użytkownika, może być używana do dostosowania widoku mapy
