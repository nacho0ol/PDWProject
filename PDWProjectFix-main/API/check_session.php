<?php
// File: api/check_session.php
session_start();
header('Content-Type: application/json');

$response = [
    'loggedin' => false,
    'username' => null,
    'role' => null
];

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    $response['loggedin'] = true;
    $response['username'] = $_SESSION['username'];
    $response['role'] = $_SESSION['role'];
}

echo json_encode($response);
?>