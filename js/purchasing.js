<script>

let purchaseData=[];
let masterItem=[];
let modal;

function loadPurchasing(){

  modal = new bootstrap.Modal(document.getElementById("purchaseModal"));

  loadTable();
  loadMaster();

}

function loadTable(){

  google.script.run

  .withSuccessHandler(function(data){

    purchaseData=data;
    renderTable(data);

  })

  .getPurchasing();

}

function renderTable(data){

  let html="";

  data.forEach(x=>{

    html+=`
    <tr>
    <td>${x.date}</td>
    <td>${x.item}</td>
    <td>${x.part}</td>
    <td>${x.merk}</td>
    <td>${x.vendor}</td>
    <td>${x.qty}</td>
    <td>${formatMoney(x.total)}</td>
    <td><button class="btn btn-danger btn-sm" onclick="deletePurchase('${x.id}')"><i class="bi bi-trash"></i></button></td>
    </tr>
    `;

  });

  document.getElementById("purchaseTable").innerHTML=html;

}

function loadMaster(){

  google.script.run

  .withSuccessHandler(function(data){

    masterItem=data;
    let html=`<option value="">Pilih Item</option>`;

    data.forEach(x=>{
      html+=`<option>${x.item}</option>`;
    });

    document.getElementById("p_item").innerHTML=html;

  })

  .getMasterItem();

  google.script.run

  .withSuccessHandler(function(data){

    let html="";
    data.forEach(x=>{
      html+=`<option>${x.nama}</option>`;
    });
    document.getElementById("p_vendor").innerHTML=html;

  })

  .getVendor();

  google.script.run

  .withSuccessHandler(function(data){

    let html="";
    data.forEach(x=>{
      html+=`<option>${x}</option>`;
    });
    document.getElementById("p_merk").innerHTML=html;

  })

  .getMerk();

}

function selectItem(){

  let val = document.getElementById("p_item").value;
  let item = masterItem.find(x=>x.item==val);

  if(item){
    document.getElementById("p_part").value=item.part;
  }

}

function openPurchaseModal(){

  document.querySelectorAll("#purchaseModal input").forEach(x=>x.value="");
  modal.show();

}

function calculateTotal(){

  let qty = Number(document.getElementById("p_qty").value);
  let price = Number(document.getElementById("p_price").value);
  document.getElementById("p_total").value = qty*price;

}

function savePurchase(){

  let data={
    date: p_date.value,
    item: p_item.value,
    part: p_part.value,
    merk: p_merk.value,
    unit: p_unit.value,
    vendor: p_vendor.value,
    satuan: p_satuan.value,
    qty: p_qty.value,
    price: p_price.value,
    inv: p_inv.value,
    pic: p_pic.value,
    job: p_job.value
  };

  google.script.run

  .withSuccessHandler(function(){

    Swal.fire("Success", "Data tersimpan", "success");
    modal.hide();
    loadTable();

  })

  .savePurchasing(data);

}

function deletePurchase(id){

  Swal.fire({
    title: "Hapus data?",
    showCancelButton: true,
    confirmButtonText: "Ya"
  })
  .then(r=>{
    if(r.isConfirmed){
      google.script.run
      .withSuccessHandler(function(){
        loadTable();
      })
      .deletePurchasing(id);
    }
  });

}

function filterPurchase(){

  let key = searchPurchase.value.toLowerCase();
  let result = purchaseData.filter(x=> JSON.stringify(x).toLowerCase().includes(key));
  renderTable(result);

}

function formatMoney(v){

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(v);

}

loadPurchasing();

</script>
