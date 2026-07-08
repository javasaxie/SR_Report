// 1. CONFIGURATION
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbxY09gk4lxY9JWMml_XA53uMmgb9dmfX-cO-u55cyuQGGFlebPTcOTzCUFscogoP2Iv/exec"; 

// 2. ROUTING
window.loadPage = async function(page) {
  const pageContainer = document.getElementById("page");
  pageContainer.innerHTML = `<div class="d-flex justify-content-center mt-5"><div class="spinner-border text-primary"></div><span class="ms-3">Memuat ${page}...</span></div>`;

  try {
    const response = await fetch(page + '.html'); 
    if (!response.ok) throw new Error(`Halaman ${page}.html tidak ditemukan.`);
    pageContainer.innerHTML = await response.text();

    // Panggil inisialisasi berdasarkan halaman
    if (page === 'dashboard') initDashboard();
    if (page === 'purchasing') initPurchasing();
  } catch (error) {
    pageContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
};

// 3. API UTILITY
window.callAPI = async function(action, data = null) {
  try {
    const response = await fetch(GAS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
      body: JSON.stringify({ action: action, data: data })
    });
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    Swal.fire('Error', 'Gagal terhubung ke database', 'error');
    return null;
  }
};

// 4. MASTER DATA (DROPDOWNS)
window.loadMasterData = async function() {
  // Panggil semua data master sekaligus
  const [items, vendors, merks] = await Promise.all([
    callAPI('getMasterItem'),
    callAPI('getVendor'),
    callAPI('getMerk')
  ]);
  
  // Isi Dropdown Item
  const itemSelect = document.getElementById('p_item');
  if (items && Array.isArray(items)) {
    itemSelect.innerHTML = '<option value="">-- Pilih Item --</option>';
    items.forEach(d => itemSelect.innerHTML += `<option value="${d.item}">${d.item} (${d.part})</option>`);
  }

  // Isi Dropdown Vendor
  const vendorSelect = document.getElementById('p_vendor');
  if (vendors && Array.isArray(vendors)) {
    vendorSelect.innerHTML = '<option value="">-- Pilih Vendor --</option>';
    vendors.forEach(d => vendorSelect.innerHTML += `<option value="${d.nama}">${d.nama}</option>`);
  }

  // Isi Dropdown Merk
  const merkSelect = document.getElementById('p_merk');
  if (merks && Array.isArray(merks)) {
    merkSelect.innerHTML = '<option value="">-- Pilih Merk --</option>';
    merks.forEach(d => merkSelect.innerHTML += `<option value="${d.merk}">${d.merk}</option>`);
  }
};

// 5. PURCHASING LOGIC
window.initPurchasing = async function() {
  const tbody = document.getElementById('purchaseTable');
  if(!tbody) return;
  
  tbody.innerHTML = `<tr><td colspan="8" class="text-center">Mengambil data...</td></tr>`;
  const response = await callAPI('getPurchasing');
  
  if (response) {
    tbody.innerHTML = '';
    if(response.length === 0) tbody.innerHTML = `<tr><td colspan="8" class="text-center">Belum ada data</td></tr>`;
    
    response.forEach((item, index) => {
      let tgl = new Date(item.date).toLocaleDateString('id-ID');
      let totalRp = Number(item.total).toLocaleString('id-ID');
      tbody.innerHTML += `
        <tr>
          <td>${tgl}</td>
          <td>${item.item}</td>
          <td>${item.part}</td>
          <td>${item.merk || '-'}</td>
          <td>${item.vendor || '-'}</td>
          <td>${item.qty}</td>
          <td>Rp ${totalRp}</td>
          <td><button class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button></td>
        </tr>`;
    });
  }
};

window.openPurchaseModal = function() {
  loadMasterData(); // Muat dropdown sebelum buka modal
  new bootstrap.Modal(document.getElementById('purchaseModal')).show();
};

window.calculateTotal = function() {
  const qty = Number(document.getElementById('p_qty').value) || 0;
  const price = Number(document.getElementById('p_price').value) || 0;
  document.getElementById('p_total').value = qty * price;
};

window.savePurchase = async function() {
  const data = {
    date: document.getElementById('p_date').value,
    item: document.getElementById('p_item').value,
    part: document.getElementById('p_part').value,
    merk: document.getElementById('p_merk').value,
    unit: document.getElementById('p_unit').value,
    vendor: document.getElementById('p_vendor').value,
    satuan: document.getElementById('p_satuan').value,
    qty: document.getElementById('p_qty').value,
    price: document.getElementById('p_price').value,
    inv: document.getElementById('p_inv').value,
    pic: document.getElementById('p_pic').value,
    job: document.getElementById('p_job').value
  };

  if (!data.date || !data.qty || !data.price) return Swal.fire('Error', 'Lengkapi data!', 'error');

  Swal.showLoading();
  const response = await callAPI('savePurchasing', data);
  if (response && response.status) {
    Swal.fire('Sukses', 'Data tersimpan', 'success');
    bootstrap.Modal.getInstance(document.getElementById('purchaseModal')).hide();
    initPurchasing();
  }
};

window.filterPurchase = function() {
  const input = document.getElementById('searchPurchase').value.toLowerCase();
  const rows = document.getElementById('purchaseTable').getElementsByTagName('tr');
  Array.from(rows).forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(input) ? "" : "none";
  });
};

// 6. DASHBOARD LOGIC
async function initDashboard() {
  const response = await callAPI('getDashboard');
  const display = document.getElementById('totalPurchaseDisplay');
  if (response && display) display.innerText = "Rp " + response.totalPurchase.toLocaleString('id-ID');
}

// 7. INITIAL LOAD
document.addEventListener('DOMContentLoaded', () => loadPage('dashboard'));
