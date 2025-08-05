<?php
/**
 * Database Connection and Management Class
 * 
 * Handles database connections, queries, and provides security through prepared statements
 * 
 * @version 1.0
 * @author Creative Digital Agency
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit('Direct access not allowed.');
}

class Database {
    private static $instance = null;
    private $connection;
    private $host;
    private $dbname;
    private $username;
    private $password;
    private $charset;
    
    /**
     * Private constructor to prevent direct instantiation
     */
    private function __construct() {
        $this->host = DB_HOST;
        $this->dbname = DB_NAME;
        $this->username = DB_USER;
        $this->password = DB_PASS;
        $this->charset = DB_CHARSET;
        
        $this->connect();
    }
    
    /**
     * Get singleton instance
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Establish database connection
     */
    private function connect() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_PERSISTENT => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$this->charset} COLLATE " . DB_COLLATE
            ];
            
            $this->connection = new PDO($dsn, $this->username, $this->password, $options);
            
        } catch (PDOException $e) {
            $this->logError("Database connection failed: " . $e->getMessage());
            
            if (DEBUG_MODE) {
                throw new Exception("Database connection failed: " . $e->getMessage());
            } else {
                throw new Exception("Database connection failed. Please try again later.");
            }
        }
    }
    
    /**
     * Get PDO connection
     */
    public function getConnection() {
        return $this->connection;
    }
    
    /**
     * Execute a prepared statement
     */
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
            
        } catch (PDOException $e) {
            $this->logError("Query failed: " . $e->getMessage() . " | SQL: " . $sql);
            
            if (DEBUG_MODE) {
                throw new Exception("Query failed: " . $e->getMessage());
            } else {
                throw new Exception("Database query failed. Please try again later.");
            }
        }
    }
    
    /**
     * Fetch single row
     */
    public function fetchRow($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetch();
    }
    
    /**
     * Fetch all rows
     */
    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }
    
    /**
     * Fetch single column value
     */
    public function fetchColumn($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchColumn();
    }
    
    /**
     * Insert record and return last insert ID
     */
    public function insert($table, $data) {
        $columns = implode(',', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));
        
        $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
        
        $this->query($sql, $data);
        return $this->connection->lastInsertId();
    }
    
    /**
     * Update records
     */
    public function update($table, $data, $where, $whereParams = []) {
        $setParts = [];
        foreach (array_keys($data) as $key) {
            $setParts[] = "{$key} = :{$key}";
        }
        $setClause = implode(', ', $setParts);
        
        $sql = "UPDATE {$table} SET {$setClause} WHERE {$where}";
        
        $params = array_merge($data, $whereParams);
        $stmt = $this->query($sql, $params);
        
        return $stmt->rowCount();
    }
    
    /**
     * Delete records
     */
    public function delete($table, $where, $whereParams = []) {
        $sql = "DELETE FROM {$table} WHERE {$where}";
        $stmt = $this->query($sql, $whereParams);
        return $stmt->rowCount();
    }
    
    /**
     * Check if record exists
     */
    public function exists($table, $where, $whereParams = []) {
        $sql = "SELECT 1 FROM {$table} WHERE {$where} LIMIT 1";
        $result = $this->fetchColumn($sql, $whereParams);
        return $result !== false;
    }
    
    /**
     * Count records
     */
    public function count($table, $where = '', $whereParams = []) {
        $sql = "SELECT COUNT(*) FROM {$table}";
        if (!empty($where)) {
            $sql .= " WHERE {$where}";
        }
        return (int) $this->fetchColumn($sql, $whereParams);
    }
    
    /**
     * Begin transaction
     */
    public function beginTransaction() {
        return $this->connection->beginTransaction();
    }
    
    /**
     * Commit transaction
     */
    public function commit() {
        return $this->connection->commit();
    }
    
    /**
     * Rollback transaction
     */
    public function rollback() {
        return $this->connection->rollback();
    }
    
    /**
     * Get table structure
     */
    public function getTableStructure($table) {
        $sql = "DESCRIBE {$table}";
        return $this->fetchAll($sql);
    }
    
    /**
     * Get database tables
     */
    public function getTables() {
        $sql = "SHOW TABLES";
        $result = $this->fetchAll($sql);
        
        $tables = [];
        foreach ($result as $row) {
            $tables[] = array_values($row)[0];
        }
        
        return $tables;
    }
    
    /**
     * Escape string for use in queries (use prepared statements instead when possible)
     */
    public function escape($string) {
        return $this->connection->quote($string);
    }
    
    /**
     * Log database errors
     */
    private function logError($message) {
        if (LOG_ENABLED) {
            $logMessage = date('Y-m-d H:i:s') . " - DATABASE ERROR: " . $message . PHP_EOL;
            file_put_contents(LOG_PATH . 'database.log', $logMessage, FILE_APPEND | LOCK_EX);
        }
    }
    
    /**
     * Prevent cloning
     */
    private function __clone() {}
    
    /**
     * Prevent unserialization
     */
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}

/**
 * Global database functions for convenience
 */

/**
 * Get database instance
 */
function db() {
    return Database::getInstance();
}

/**
 * Execute query
 */
function db_query($sql, $params = []) {
    return db()->query($sql, $params);
}

/**
 * Fetch single row
 */
function db_fetch_row($sql, $params = []) {
    return db()->fetchRow($sql, $params);
}

/**
 * Fetch all rows
 */
function db_fetch_all($sql, $params = []) {
    return db()->fetchAll($sql, $params);
}

/**
 * Fetch single column
 */
function db_fetch_column($sql, $params = []) {
    return db()->fetchColumn($sql, $params);
}

/**
 * Insert record
 */
function db_insert($table, $data) {
    return db()->insert($table, $data);
}

/**
 * Update records
 */
function db_update($table, $data, $where, $whereParams = []) {
    return db()->update($table, $data, $where, $whereParams);
}

/**
 * Delete records
 */
function db_delete($table, $where, $whereParams = []) {
    return db()->delete($table, $where, $whereParams);
}

/**
 * Check if record exists
 */
function db_exists($table, $where, $whereParams = []) {
    return db()->exists($table, $where, $whereParams);
}

/**
 * Count records
 */
function db_count($table, $where = '', $whereParams = []) {
    return db()->count($table, $where, $whereParams);
}

/**
 * Get site setting
 */
function get_setting($key, $default = null) {
    static $settings_cache = [];
    
    if (!isset($settings_cache[$key])) {
        $value = db_fetch_column(
            "SELECT setting_value FROM site_settings WHERE setting_key = ?",
            [$key]
        );
        
        $settings_cache[$key] = $value !== false ? $value : $default;
    }
    
    return $settings_cache[$key];
}

/**
 * Update site setting
 */
function update_setting($key, $value) {
    $exists = db_exists('site_settings', 'setting_key = ?', [$key]);
    
    if ($exists) {
        return db_update(
            'site_settings',
            ['setting_value' => $value, 'updated_at' => date('Y-m-d H:i:s')],
            'setting_key = ?',
            [$key]
        );
    } else {
        return db_insert('site_settings', [
            'setting_key' => $key,
            'setting_value' => $value,
            'setting_type' => 'text',
            'category' => 'general'
        ]);
    }
}

/**
 * Get portfolio projects
 */
function get_portfolio_projects($limit = null, $offset = 0, $category = null, $status = 'published') {
    $sql = "SELECT * FROM portfolio_projects WHERE status = ?";
    $params = [$status];
    
    if ($category) {
        $sql .= " AND JSON_CONTAINS(categories, ?)";
        $params[] = json_encode($category);
    }
    
    $sql .= " ORDER BY is_featured DESC, sort_order ASC, created_at DESC";
    
    if ($limit) {
        $sql .= " LIMIT ?";
        $params[] = $limit;
        
        if ($offset > 0) {
            $sql .= " OFFSET ?";
            $params[] = $offset;
        }
    }
    
    return db_fetch_all($sql, $params);
}

/**
 * Get portfolio project by slug
 */
function get_portfolio_project($slug) {
    return db_fetch_row(
        "SELECT * FROM portfolio_projects WHERE slug = ? AND status = 'published'",
        [$slug]
    );
}

/**
 * Get team members
 */
function get_team_members($limit = null, $featured_only = false) {
    $sql = "SELECT * FROM team_members WHERE is_active = 1";
    $params = [];
    
    if ($featured_only) {
        $sql .= " AND is_featured = 1";
    }
    
    $sql .= " ORDER BY sort_order ASC, first_name ASC";
    
    if ($limit) {
        $sql .= " LIMIT ?";
        $params[] = $limit;
    }
    
    return db_fetch_all($sql, $params);
}

/**
 * Get testimonials
 */
function get_testimonials($limit = null, $featured_only = false) {
    $sql = "SELECT * FROM testimonials WHERE is_active = 1";
    $params = [];
    
    if ($featured_only) {
        $sql .= " AND is_featured = 1";
    }
    
    $sql .= " ORDER BY sort_order ASC, created_at DESC";
    
    if ($limit) {
        $sql .= " LIMIT ?";
        $params[] = $limit;
    }
    
    return db_fetch_all($sql, $params);
}

/**
 * Get services
 */
function get_services($limit = null, $featured_only = false) {
    $sql = "SELECT * FROM services WHERE is_active = 1";
    $params = [];
    
    if ($featured_only) {
        $sql .= " AND is_featured = 1";
    }
    
    $sql .= " ORDER BY sort_order ASC, name ASC";
    
    if ($limit) {
        $sql .= " LIMIT ?";
        $params[] = $limit;
    }
    
    return db_fetch_all($sql, $params);
}

/**
 * Save contact message
 */
function save_contact_message($data) {
    // Add metadata
    $data['ip_address'] = $_SERVER['REMOTE_ADDR'] ?? '';
    $data['user_agent'] = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $data['referrer'] = $_SERVER['HTTP_REFERER'] ?? '';
    
    // UTM parameters
    $data['utm_source'] = $_GET['utm_source'] ?? null;
    $data['utm_medium'] = $_GET['utm_medium'] ?? null;
    $data['utm_campaign'] = $_GET['utm_campaign'] ?? null;
    
    // Convert services array to JSON
    if (isset($data['services_interested']) && is_array($data['services_interested'])) {
        $data['services_interested'] = json_encode($data['services_interested']);
    }
    
    return db_insert('contact_messages', $data);
}

/**
 * Track page view
 */
function track_page_view($url, $title = null) {
    if (!LOG_ENABLED) {
        return;
    }
    
    $data = [
        'page_url' => $url,
        'page_title' => $title,
        'visitor_ip' => $_SERVER['REMOTE_ADDR'] ?? '',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
        'referrer' => $_SERVER['HTTP_REFERER'] ?? '',
        'utm_source' => $_GET['utm_source'] ?? null,
        'utm_medium' => $_GET['utm_medium'] ?? null,
        'utm_campaign' => $_GET['utm_campaign'] ?? null,
        'session_id' => session_id()
    ];
    
    return db_insert('page_analytics', $data);
}

// Initialize database connection
try {
    Database::getInstance();
} catch (Exception $e) {
    if (DEBUG_MODE) {
        die("Database initialization failed: " . $e->getMessage());
    } else {
        die("Website temporarily unavailable. Please try again later.");
    }
}
?>