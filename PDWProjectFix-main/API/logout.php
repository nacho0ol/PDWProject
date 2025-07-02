<?php
// File: api/logout.php
session_start();

// Hapus semua variabel sesi
session_unset();

// Hancurkan sesi
session_destroy();

// Kirim respons sukses
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Logout berhasil.']);
?>