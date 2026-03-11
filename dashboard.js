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
        document.getElementById("countStudents").textContent = data.countStudents || 0;
        document.getElementById("countAdmin").textContent = data.countAdmin || 0;

    } catch(err) {
        console.log("โหลดข้อมูล Dashboard ไม่สำเร็จ:", err);
    }
}

// =============================
// 🎨 สี Dashboard
// =============================
const colors = [
    "#6366F1",
    "#22C55E",
    "#EF4444",
    "#f59e0b",
    "#06B6D4",
    "#8b5cf6",
    "#14b8a6",
    "#f97316"
];

// =============================
// 📊 โหลดกราฟทั้งหมด
// =============================
async function loadCharts(){

    try{

        const res = await fetch(window.apiUrl('/api/dashboard-chart'));
        const data = await res.json();

        // =====================
        // 📊 การจองตามวัน
        // =====================
        let dateData = Object.entries(data.byDate || {});

        // เรียงวันที่
        dateData.sort((a,b)=> new Date(a[0]) - new Date(b[0]));

        let dateLabels = dateData.map(d=>d[0]);
        let dateValues = dateData.map(d=>d[1]);

        if(dateLabels.length === 0){
            dateLabels = ["ยังไม่มีข้อมูล"];
            dateValues = [0];
        }

        if(bookingChart) bookingChart.destroy();

        bookingChart = new Chart(document.getElementById("myChart"),{
            type:"bar",
            data:{
                labels:dateLabels,
                datasets:[{
                    label:"จำนวนการจองต่อวัน",
                    data:dateValues,
                    backgroundColor:colors,
                    borderRadius:8
                }]
            },
            options:{
                responsive:true,
                maintainAspectRatio:false,
                plugins:{
                    legend:{display:true}
                },
                scales:{
                    y:{
                        beginAtZero:true,
                        grid:{color:"#eee"}
                    },
                    x:{
                        grid:{display:false}
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

        roomChart = new Chart(document.getElementById("popularCategory"),{
            type:"doughnut",
            data:{
                labels:roomLabels,
                datasets:[{
                    data:roomValues,
                    backgroundColor:colors,
                    borderWidth:0
                }]
            },
            options:{
                responsive:true,
                maintainAspectRatio:false,
                cutout:"65%",
                plugins:{
                    legend:{
                        position:"bottom"
                    }
                }
            }
        });

        // =====================
        // ⏰ การจองตามช่วงเวลา
        // =====================
        const timeCanvas = document.getElementById("timeChart");

        if(timeCanvas){

            let timeData = Object.entries(data.byTime || {});

            // เรียงตามเวลาเริ่ม
            timeData.sort((a,b)=>{

                const getStart = (t)=> t.split("-")[0].trim();

                return getStart(a[0]).localeCompare(getStart(b[0]));

            });

            let timeLabels = timeData.map(t=>t[0]);
            let timeValues = timeData.map(t=>t[1]);

            if(timeLabels.length === 0){
                timeLabels = ["ยังไม่มีข้อมูล"];
                timeValues = [0];
            }

            if(timeChart) timeChart.destroy();

            timeChart = new Chart(timeCanvas,{
                type:"bar",
                data:{
                    labels:timeLabels,
                    datasets:[{
                        label:"จำนวนการจองตามช่วงเวลา",
                        data:timeValues,
                        backgroundColor:colors,
                        borderRadius:8
                    }]
                },
                options:{
                    responsive:true,
                    maintainAspectRatio:false,
                    scales:{
                        y:{
                            beginAtZero:true,
                            grid:{color:"#eee"}
                        },
                        x:{
                            grid:{display:false}
                        }
                    }
                }
            });

        }

    }
    catch(err){
        console.log("โหลดกราฟไม่สำเร็จ:",err);
    }

}

// =============================
// 🚀 เริ่มทำงาน
// =============================
loadDashboard();
loadCharts();

// รีเฟรชทุก 5 วินาที
setInterval(()=>{
    loadDashboard();
    loadCharts();
},5000);

