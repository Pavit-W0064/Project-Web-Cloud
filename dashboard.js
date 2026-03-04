let bookingChart;
let roomChart;
let timeChart;

// =============================
// 📦 โหลดตัวเลข KPI
// =============================
async function loadDashboard(){
    try {
        const res = await fetch(window.apiUrl('/api/dashboard'));
        const data = await res.json();

        document.getElementById("countBookings").textContent = data.countBookings || 0;
        document.getElementById("countRoomsUsed").textContent = data.countRoomsUsed || 0;
        document.getElementById("countStudents").textContent = data.countStudents || 0;
        document.getElementById("countAdmin").textContent = data.countAdmin || 0;

    } catch(err) {
        console.log("โหลดข้อมูล Dashboard ไม่สำเร็จ:", err);
    }
}

// =============================
// 🎨 สีมาตรฐาน Dashboard
// =============================
const colors = [
    "#ff6384",
    "#36a2eb",
    "#4bc0c0",
    "#ffcd56",
    "#9966ff",
    "#ff9f40",
    "#2ecc71",
    "#e74c3c"
];

// =============================
// 📊 โหลดกราฟทั้งหมด
// =============================
async function loadCharts(){
    try {
        const res = await fetch(window.apiUrl('/api/dashboard-chart'));
        const data = await res.json();

        // =====================
        // 📊 การจองตามวัน
        // =====================
        let dateLabels = Object.keys(data.byDate || {});
        let dateValues = Object.values(data.byDate || {});

        if(dateLabels.length === 0){
            dateLabels = ["ยังไม่มีข้อมูล"];
            dateValues = [0];
        }

        if(bookingChart) bookingChart.destroy();
        bookingChart = new Chart(document.getElementById("myChart"), {
            type: "bar",
            data: {
                labels: dateLabels,
                datasets: [{
                    label: "จำนวนการจองต่อวัน",
                    data: dateValues,
                    backgroundColor: colors,
                    borderRadius: 8,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: "#eee" }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });

        // =====================
        // 🍩 การใช้ห้อง
        // =====================
        let roomLabels = Object.keys(data.byRoom || {});
        let roomValues = Object.values(data.byRoom || {});

        if(roomLabels.length === 0){
            roomLabels = ["ยังไม่มีข้อมูล"];
            roomValues = [0];
        }

        if(roomChart) roomChart.destroy();
        roomChart = new Chart(document.getElementById("popularCategory"), {
            type: "doughnut",
            data: {
                labels: roomLabels,
                datasets: [{
                    data: roomValues,
                    backgroundColor: colors,
                    borderWidth: 0
                }]
            },
            options: {
                cutout: "65%",
                plugins: {
                    legend: { position: "top" }
                }
            }
        });

        // =====================
        // ⏰ การจองตามช่วงเวลา
        // =====================
        const timeCanvas = document.getElementById("timeChart");
        if(timeCanvas){
            let timeLabels = Object.keys(data.byTime || {});
            let timeValues = Object.values(data.byTime || {});

            if(timeLabels.length === 0){
                timeLabels = ["ยังไม่มีข้อมูล"];
                timeValues = [0];
            }

            if(timeChart) timeChart.destroy();
            timeChart = new Chart(timeCanvas, {
                type: "bar",
                data: {
                    labels: timeLabels,
                    datasets: [{
                        label: "จำนวนการจองตามช่วงเวลา",
                        data: timeValues,
                        backgroundColor: colors,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: "#eee" }
                        },
                        x: {
                            grid: { display: false }
                        }
                    }
                }
            });
        }

    } catch(err){
        console.log("โหลดกราฟไม่สำเร็จ:", err);
    }
}

// =============================
// 🚀 เริ่มทำงาน
// =============================
loadDashboard();
loadCharts();

// รีเฟรชอัตโนมัติ
setInterval(() => {
    loadDashboard();
    loadCharts();
}, 5000);