/**
 * Frontend config:
 * - ให้ API อยู่ "origin เดียวกับเว็บ" (เช่น http://15.x.x.x หรือ https://yourdomain)
 * - ถ้า deploy แบบ Nginx reverse proxy /api -> Node.js, ให้ใช้ same-origin แบบนี้ดีที่สุด
 */
/**
 * Frontend config
 *
 * - Localhost (run everything on same origin): ปล่อยค่า default ได้เลย
 * - Cloud แบบแยกโดเมน (เช่น Frontend บน Amplify / Backend บน EC2):
 *   ให้ตั้งค่า API_BASE เป็น URL ของ Backend
 *
 * วิธีที่ง่ายสุด: ใส่ค่าไว้ใน localStorage ครั้งเดียว
 *   เปิด Console แล้วรัน:
 *     localStorage.setItem('API_BASE', 'http://<EC2_PUBLIC_IP>:3000')
 *   หรือถ้ามีโดเมน:
 *     localStorage.setItem('API_BASE', 'https://api.yourdomain.com')
 */

window.API_BASE = (localStorage.getItem('API_BASE') || window.location.origin).replace(/\/$/, '');

// helper ให้เรียกง่ายขึ้น
window.apiUrl = function apiUrl(path) {
  if (!path) return window.API_BASE;
  return `${window.API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};
