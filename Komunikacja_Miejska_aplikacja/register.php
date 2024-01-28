<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "komunikacja_miejska";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $newUsername = $_POST['newUsername'];
    $newPassword = $_POST['newPassword'];
    $confirmPassword = $_POST['confirmPassword'];

    // Sprawdzenie, czy hasła są takie same
    if ($newPassword !== $confirmPassword) {
        echo "Hasła nie są takie same.";
        exit();
    }

    // Hashowanie hasła używając MD5
    $hashedPassword = md5($newPassword);

    // Sprawdzenie, czy użytkownik już istnieje
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $newUsername);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "Użytkownik o takiej nazwie już istnieje.";
        exit();
    }

    // Wstawienie nowego użytkownika do bazy danych
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $newUsername, $hashedPassword);
    $stmt->execute();

    echo "Rejestracja przebiegła pomyślnie. Przekierowanie...";
    header("Location: wyglad.html");
    exit();
}

$conn->close();
?>
