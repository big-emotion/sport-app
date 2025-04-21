<?php

try {
    $pdo = new PDO('pgsql:host=postgres;dbname=sport_db', 'sport_user', 'sport_pass');
    echo "Database connection successful!\n";
    
    // Test a simple query
    $stmt = $pdo->query("SELECT 1");
    if ($stmt->fetch()) {
        echo "Query execution successful!\n";
    }
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
} 