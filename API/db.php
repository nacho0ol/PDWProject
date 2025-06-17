<?php
// File: api/db.php

$host = 'localhost';
$dbname = 'merchrc'; // Sesuaikan dengan nama database Anda
$user = 'root'; // User default Laragon
$password = ''; // Password default Laragon kosong

// Membuat koneksi menggunakan PDO (PHP Data Objects) untuk keamanan
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    
    // Mengatur mode error PDO ke exception agar lebih mudah men-debug
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Mencegah emulated prepares untuk lapisan keamanan ekstra
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

} catch (PDOException $e) {
    // Jika koneksi gagal, hentikan skrip dan kirim pesan error dalam format JSON
    http_response_code(500); // Internal Server Error
    die(json_encode(['error' => 'Koneksi database gagal: ' . $e->getMessage()]));
}
?>