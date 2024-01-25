const mysql = require('mysql2')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
<<<<<<< HEAD
    password: 'root',
=======
    password: '1234567890',
>>>>>>> bf5155cb6ac8578d9868c130bf1270d93b6cf99a
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