<?php
// File: api/login.php

// Mulai sesi PHP. Ini HARUS menjadi baris paling pertama.
session_start();

header('Content-Type: application/json');

require_once '../config/database.php';
require_once '../models/User.php'; // buat model User sederhana

// Ambil data yang dikirim dari form JavaScript
$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->username) || !isset($data->password)) {
    echo json_encode(['success' => false, 'error' => 'Data tidak lengkap.']);
    exit();
}

$database = new Database();
$db = $database->connect();

// Cek user di database
$query = "SELECT id, username, password, role FROM users WHERE username = :username LIMIT 1";
$stmt = $db->prepare($query);

// Bind parameter
$username = htmlspecialchars(strip_tags($data->username));
$stmt->bindParam(':username', $username);
$stmt->execute();

if ($stmt->rowCount() == 1) {
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    $hashed_password = $user['password'];

    // Verifikasi password yang diinput dengan hash di database
    if (password_verify($data->password, $hashed_password)) {
        // Password cocok, login berhasil.
        
        // Regenerasi ID sesi untuk keamanan
        session_regenerate_id(true);

        // Simpan informasi user ke dalam Sesi
        $_SESSION['loggedin'] = true;
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        echo json_encode([
            'success' => true,
            'message' => 'Login berhasil!',
            'user' => [
                'username' => $user['username'],
                'role' => $user['role']
            ]
        ]);
    } else {
        // Password tidak cocok
        echo json_encode(['success' => false, 'error' => 'Username atau password salah.']);
    }
} else {
    // User tidak ditemukan
    echo json_encode(['success' => false, 'error' => 'Username atau password salah.']);
}
?>