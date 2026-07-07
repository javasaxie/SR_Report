<script>

let chartInstance = null;

function loadDashboard() {
  console.log("loadDashboard called");
  
  google.script.run
    .withSuccessHandler(function(data) {
      console.log("Dashboard data:", data);
      
      document.getElementById("totalPurchase").innerHTML = formatMoney(data.totalPurchase);
      document.getElementById("totalDana").innerHTML = formatMoney(data.totalDana);
      document.getElementById("balance").innerHTML = formatMoney(data.balance);
      document.getElementById("purchaseCount").innerHTML = data.purchaseCount;
      
      renderChart();
    })
    .getDashboard();
}

function renderChart() {
  google.script.run
    .withSuccessHandler(function(data) {
      if (!data || data.length === 0) return;
      
      let itemNames = [];
      let itemTotals = [];
      
      data.forEach(x => {
        itemNames.push(x.item);
        itemTotals.push(x.total);
      });
      
      const ctx = document.getElementById("purchaseChart");
      if (!ctx) return;
      
      if (chartInstance) {
        chartInstance.destroy();
      }
      
      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: itemNames,
          datasets: [{
            label: "Total Pembelian",
            data: itemTotals,
            backgroundColor: "rgba(91, 95, 199, 0.5)",
            borderColor: "rgba(91, 95, 199, 1)",
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    })
    .getPurchasing();
}

function formatMoney(v) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(v || 0);
}

loadDashboard();

</script>