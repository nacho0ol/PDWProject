<?php
class Database {
    private $host = '127.0.0.1';  
    private $port = '3305';      
    private $db_name = 'merchrc';
    private $username = 'root';
    private $password = '';       
    private $conn;

    public function connect() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Connection Error: " . $e->getMessage();
            return null;  // Return null if the connection fails
        }
        
        return $this->conn;
    }
}

?>



