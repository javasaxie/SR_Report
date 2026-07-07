<script>

let danaModal;

function loadDana(){

  danaModal = new bootstrap.Modal(document.getElementById("danaModal"));
  loadDanaTable();

}

function loadDanaTable(){

  google.script.run.withSuccessHandler(function(data){

    let html = "";

    data.forEach(x=>{
      html += `<tr><td>${x.date}</td><td>${x.sumber}</td><td>${x.tujuan}</td><td>${formatMoney(x.nominal)}</td><td>${x.via}</td><td><button class="btn btn-danger btn-sm" onclick="deleteDana('${x.id}')"><i class="bi bi-trash"></i></button></td></tr>`;
    });

    danaTable.innerHTML = html;

  }).getDana();

}

function openDana(){

  danaModal.show();

}

function saveDana(){

  let data = {
    date: d_date.value,
    sumber: d_sumber.value,
    tujuan: d_tujuan.value,
    nominal: d_nominal.value,
    via: d_via.value
  };

  google.script.run.withSuccessHandler(()=>{

    Swal.fire("Success", "Dana masuk tersimpan", "success");
    danaModal.hide();
    loadDanaTable();

  }).saveDana(data);

}

function deleteDana(id){

  google.script.run.withSuccessHandler(()=>{
    loadDanaTable();
  }).deleteDana(id);

}

function formatMoney(v){

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(v);

}

loadDana();

</script>