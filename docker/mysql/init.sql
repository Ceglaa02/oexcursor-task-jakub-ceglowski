CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    age INT NOT NULL,
    login VARCHAR(255) NOT NULL UNIQUE
);

ALTER USER 'super_user'@'%' IDENTIFIED BY 'oexcursor34092';
GRANT ALL PRIVILEGES ON oexcursor.* TO 'super_user'@'%';
FLUSH PRIVILEGES;
