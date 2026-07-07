<script>

function showMaster(type) {
  if (type == "item") loadItem();
  if (type == "vendor") loadVendor();
  if (type == "merk") loadMerk();
}

function loadItem() {
  google.script.run.withSuccessHandler(data => {
    let html = `<h4>Master Item</h4><table class="table"><tr><th>Item</th><th>Part</th><th>Persamaan1</th><th>Persamaan2</th></tr>`;
    if (data) {
      data.forEach(x => {
        html += `<tr><td>${x.item}</td><td>${x.part}</td><td>${x.persamaan1}</td><td>${x.persamaan2}</td></tr>`;
      });
    }
    html += "</table>";
    document.getElementById("masterContent").innerHTML = html;
  }).getMasterItem();
}

function loadVendor() {
  google.script.run.withSuccessHandler(data => {
    let html = `<h4>Master Vendor</h4><table class="table"><tr><th>Nama</th><th>Telp</th><th>Alamat</th></tr>`;
    if (data) {
      data.forEach(x => {
        html += `<tr><td>${x.nama}</td><td>${x.telp}</td><td>${x.alamat}</td></tr>`;
      });
    }
    html += "</table>";
    document.getElementById("masterContent").innerHTML = html;
  }).getVendor();
}

function loadMerk() {
  google.script.run.withSuccessHandler(data => {
    let html = `<h4>Master Merk</h4><ul>`;
    if (data) {
      data.forEach(x => {
        html += `<li>${x}</li>`;
      });
    }
    html += `</ul>`;
    document.getElementById("masterContent").innerHTML = html;
  }).getMerk();
}

</script>