<script>

let chartInstance = null;

function loadDashboard(){

  google.script.run

  .withSuccessHandler(function(data){

    document.getElementById("totalPurchase").innerHTML = formatMoney(data.totalPurchase);
    document.getElementById("totalDana").innerHTML = formatMoney(data.totalDana);
    document.getElementById("balance").innerHTML = formatMoney(data.balance);
    document.getElementById("purchaseCount").innerHTML = data.purchaseCount;

    renderChart();

  })

  .getDashboard();

}

function renderChart(){

  google.script.run

  .withSuccessHandler(function(data){

    let itemNames = [];
    let itemTotals = [];

    data.forEach(x => {
      itemNames.push(x.item);
      itemTotals.push(x.total);
    });

    const ctx = document.getElementById("purchaseChart").getContext("2d");

    if(chartInstance){
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: itemNames,
        datasets: [{
          label: "Total Pembelian",
          data: itemTotals,
          backgroundColor: [
            "rgba(54, 162, 235, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(255, 159, 64, 0.5)"
          ],
          borderColor: [
            "rgb(54, 162, 235)",
            "rgb(75, 192, 192)",
            "rgb(255, 206, 86)",
            "rgb(153, 102, 255)",
            "rgb(255, 159, 64)"
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top"
          }
        },
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

function formatMoney(v){

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(v);

}

loadDashboard();

</script>
