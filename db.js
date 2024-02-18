const mysql = require('mysql2')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234567890',
    database: 'decentStorage',
});
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL!');
  
  });
module.exports = db


// CREATE TABLE users (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(100) NOT NULL,
//   email VARCHAR(255) NOT NULL,
//   password VARCHAR(255) NOT NULL,
//   type ENUM('DO', 'SO') NOT NULL
// );

// CREATE TABLE myStorage (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   do_id INT,
//   so_id INT,
//   capacity BIGINT,
//   remainingCapacity BIGINT,
//   active BOOLEAN DEFAULT true,
//   address VARCHAR(255), -- Adjust the length based on your requirements
//   FOREIGN KEY (do_id) REFERENCES users(id),
//   FOREIGN KEY (so_id) REFERENCES users(id)
// );

//
// CREATE TABLE files (
//   id INT PRIMARY KEY,
//   do_id INT,
//   so_id INT,
//   fileName VARCHAR(255),
//   fileHash VARCHAR(255),
//   possession ENUM('DO', 'SO')
// );
