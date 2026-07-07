<script>

let reportData=[];

function loadReport(){

  let start = r_start.value;
  let end = r_end.value;

  if(!start || !end){
    Swal.fire("Warning", "Pilih periode", "warning");
    return;
  }

  google.script.run

  .withSuccessHandler(function(data){

    reportData=data;
    renderReport(data);

  })

  .getReport(start,end);

}

function renderReport(data){

  let total=0;
  let html=`
  <table class="table">
  <tr>
  <th>Date</th>
  <th>Item</th>
  <th>Vendor</th>
  <th>Qty</th>
  <th>Total</th>
  </tr>
  `;

  data.forEach(x=>{

    total+=Number(x.total);
    html+=`
    <tr>
    <td>${x.date}</td>
    <td>${x.item}</td>
    <td>${x.vendor}</td>
    <td>${x.qty}</td>
    <td>${formatMoney(x.total)}</td>
    </tr>
    `;

  });

  html+=`
  <tr>
  <th colspan="4">TOTAL</th>
  <th>${formatMoney(total)}</th>
  </tr>
  </table>
  `;

  reportArea.innerHTML=html;

}

function exportPDF(){

  if(reportData.length==0){
    Swal.fire("Data kosong", "", "warning");
    return;
  }

  google.script.run

  .withSuccessHandler(function(url){
    window.open(url);
  })

  .createPDF(reportData);

}

function exportExcel(){

  google.script.run

  .withSuccessHandler(function(url){
    window.open(url);
  })

  .createExcel(reportData);

}

function formatMoney(v){

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(v);

}

</script>
