const mysql = require('mysql2');
const path = require('path');

// โหลด .env จากโฟลเดอร์เดียวกับไฟล์นี้ (สำคัญเวลา run บน EC2)
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'queue_db',
  port: Number(process.env.DB_PORT || 3306),
});

// ล็อกสถานะการเชื่อมต่อ (ช่วย debug ตอน deploy)
db.connect((err) => {
  if (err) {
    console.log('❌ DB error:', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

module.exports = db;
