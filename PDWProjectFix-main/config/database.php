<?php
class Database {
    private $host = 'localhost:3307';
    private $db_name = 'merchrc';
    private $username = 'root';
    private $password = '';
    private $conn;

    public function connect() {
        $this->conn = null;
        $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->db_name . ';charset=utf8';

        try {
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC); // product a => nama product
        } catch(PDOException $e) {
            die('Connection Error: ' . $e->getMessage());
        }

        return $this->conn;
    }
}
?>