<?php
// File: models/User.php

class User {
    // Properti untuk koneksi database & nama tabel
    private $conn;
    private $table_name = "users";

    // Properti objek (sesuai dengan kolom di tabel users)
    public $id;
    public $username;
    public $password;
    public $role;

    /**
     * Constructor untuk kelas User.
     * Menerima koneksi database untuk digunakan di dalam kelas.
     * @param PDO $db Objek koneksi database (PDO).
     */
    public function __construct($db) {
        $this->conn = $db;
    }
}
?>