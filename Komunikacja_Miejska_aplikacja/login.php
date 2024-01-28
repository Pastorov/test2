<?php
session_start();

$servername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbname = "komunikacja_miejska";

$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST['username'];
    $pass = $_POST['password'];

    // Hashowanie hasła używając MD5
    $hashedPassword = md5($pass);

    // Zapytanie SQL do sprawdzenia hasła użytkownika
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $user, $hashedPassword);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Logowanie udane
        $_SESSION['loggedin'] = true;
        $_SESSION['username'] = $user;
        setcookie("log", "true", time() + (86400 * 30), "/");
        header("Location: wyglad.html");
    } else {
        // Logowanie nieudane
        echo "Błędna nazwa użytkownika lub hasło";
    }
}

$conn->close();
?>
