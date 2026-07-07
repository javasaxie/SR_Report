<script>

let danaModal;

function loadDana() {
  console.log("loadDana called");
  danaModal = new bootstrap.Modal(document.getElementById("danaModal"));
  loadDanaTable();
}

function loadDanaTable() {
  google.script.run.withSuccessHandler(function(data) {
    let html = "";
    if (data) {
      data.forEach(x => {
        html += `<tr><td>${x.date}</td><td>${x.sumber}</td><td>${x.tujuan}</td><td>${formatMoney(x.nominal)}</td><td>${x.via}</td><td><button class="btn btn-danger btn-sm" onclick="deleteDana('${x.id}')"><i class="bi bi-trash"></i></button></td></tr>`;
      });
    }
    document.getElementById("danaTable").innerHTML = html;
  }).getDana();
}

function openDana() {
  document.getElementById("d_date").value = "";
  document.getElementById("d_sumber").value = "";
  document.getElementById("d_tujuan").value = "";
  document.getElementById("d_nominal").value = "";
  danaModal.show();
}

function saveDana() {
  let data = {
    date: document.getElementById("d_date").value,
    sumber: document.getElementById("d_sumber").value,
    tujuan: document.getElementById("d_tujuan").value,
    nominal: document.getElementById("d_nominal").value,
    via: document.getElementById("d_via").value
  };

  google.script.run.withSuccessHandler(() => {
    Swal.fire("Success", "Dana masuk tersimpan", "success");
    danaModal.hide();
    loadDanaTable();
  }).saveDana(data);
}

function deleteDana(id) {
  google.script.run.withSuccessHandler(() => {
    loadDanaTable();
  }).deleteDana(id);
}

function formatMoney(v) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(v || 0);
}

loadDana();

</script>