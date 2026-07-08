// GANTI DENGAN WEB APP URL DARI GOOGLE APPS SCRIPT ANDA
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbwjofkZn48-tq_qVS8sLlWqpe0C7CrB_-VRvlG4yBZgOqmsNQZ5JUQweHjAPPePbl0I/exec"; 

// Fungsi Routing Halaman
window.loadPage = async function(page) {
  const pageContainer = document.getElementById("page");
  pageContainer.innerHTML = `
    <div class="d-flex justify-content-center align-items-center mt-5">
      <div class="spinner-border text-primary"></div>
      <span class="ms-3">Memuat ${page}...</span>
    </div>
  `;

  try {
    const response = await fetch(page + '.html'); 
    if (!response.ok) throw new Error(`Halaman ${page}.html tidak ditemukan.`);
    
    const htmlContent = await response.text();
    pageContainer.innerHTML = htmlContent; // Tampilkan HTML murni

    // PANGGIL FUNGSI LOGIKA BERDASARKAN HALAMAN YANG DIBUKA
    if (page === 'dashboard') initDashboard();
    if (page === 'purchasing') initPurchasing();

  } catch (error) {
    pageContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
};

// Fungsi Komunikasi API ke Google Sheets
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
    if (typeof Swal !== 'undefined') Swal.fire('Error', 'Gagal terhubung ke database', 'error');
    return null;
  }
};

// ==========================================
// LOGIKA HALAMAN PURCHASING
// ==========================================

// 1. Fungsi Utama saat Halaman Purchasing Dibuka
window.initPurchasing = async function() {
  let tbody = document.getElementById('purchaseTable');
  
  if(tbody) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center p-3"><div class="spinner-border text-primary"></div><br>Mengambil data...</td></tr>`;
  }
  
  // Ambil data dari API Apps Script
  let response = await callAPI('getPurchasing');
  
  if (response && tbody) {
    tbody.innerHTML = '';
    
    if(response.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center">Belum ada data</td></tr>`;
      return;
    }

    // Render tabel
    response.forEach(item => {
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
          <td>
            <button class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      `;
    });
  }
};

// 2. Membuka Modal Input Data
window.openPurchaseModal = function() {
  // Menggunakan Bootstrap Modal API
  const modalElement = document.getElementById('purchaseModal');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
};

// 3. Menghitung Total Otomatis saat Qty / Price diketik
window.calculateTotal = function() {
  let qty = Number(document.getElementById('p_qty').value) || 0;
  let price = Number(document.getElementById('p_price').value) || 0;
  let total = qty * price;
  
  document.getElementById('p_total').value = total;
};

// 4. Menyimpan Data ke Database Spreadsheet
window.savePurchase = async function() {
  // Kumpulkan data dari form input
  let data = {
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

  // Validasi sederhana
  if (!data.date || !data.qty || !data.price) {
    Swal.fire('Perhatian', 'Tanggal, Qty, dan Price wajib diisi!', 'warning');
    return;
  }

  // Tampilkan loading screen dengan SweetAlert
  Swal.fire({
    title: 'Menyimpan...',
    text: 'Mohon tunggu sebentar',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  // Kirim data ke API (Fungsi 'savePurchasing' di code.gs)
  let response = await callAPI('savePurchasing', data);

  if (response && response.status) {
    Swal.fire('Berhasil', response.message, 'success');
    
    // Tutup Modal
    const modalElement = document.getElementById('purchaseModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if(modalInstance) modalInstance.hide();
    
    // Kosongkan form
    document.querySelectorAll('.modal-body input').forEach(input => input.value = '');
    
    // Muat ulang tabel
    initPurchasing();
  } else {
    Swal.fire('Error', 'Gagal menyimpan data.', 'error');
  }
};

// 5. Fitur Pencarian Tabel
window.filterPurchase = function() {
  let input = document.getElementById('searchPurchase').value.toLowerCase();
  let table = document.getElementById('purchaseTable');
  let tr = table.getElementsByTagName('tr');

  for (let i = 0; i < tr.length; i++) {
    let tdText = tr[i].textContent || tr[i].innerText;
    if (tdText.toLowerCase().indexOf(input) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
};

// Fungsi untuk memuat data master ke dalam dropdown
window.loadMasterData = async function() {
  let itemSelect = document.getElementById('p_item');
  
  // Ambil data item dari Google Sheets
  let items = await callAPI('getMasterItem');
  
  if (items && Array.isArray(items)) {
    // Reset dropdown ke pilihan default
    itemSelect.innerHTML = '<option value="">-- Pilih Item --</option>';
    
    // Tambahkan opsi baru
    items.forEach(data => {
      let option = document.createElement('option');
      option.value = data.item; // Sesuaikan dengan field di database Anda
      option.textContent = data.item + ' (' + data.part + ')'; // Tampilan di dropdown
      itemSelect.appendChild(option);
    });
  }
};

// Modifikasi fungsi openPurchaseModal agar otomatis memuat data saat dibuka
window.openPurchaseModal = function() {
  const modalElement = document.getElementById('purchaseModal');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
  
  // Panggil fungsi untuk mengisi dropdown saat modal dibuka
  loadMasterData();
};

// 6. Placeholder untuk dropdown item (Master Data)
window.selectItem = function() {
  // Nantinya di sini bisa diisi logika untuk otomatis memunculkan 
  // Part Number atau Satuan saat item dipilih dari Dropdown
  console.log("Item terpilih:", document.getElementById('p_item').value);
};

// ==========================================
// LOGIKA MASING-MASING HALAMAN (Pindahkan ke sini)
// ==========================================

async function initDashboard() {
  let response = await callAPI('getDashboard');
  let display = document.getElementById('totalPurchaseDisplay');
  
  if (response && display) {
    display.innerText = "Rp " + response.totalPurchase.toLocaleString('id-ID');
  } else if (display) {
    display.innerText = "Gagal memuat data";
  }
}

async function initPurchasing() {
  let response = await callAPI('getPurchasing');
  let tbody = document.getElementById('tablePurchasingBody');
  
  if (response && tbody) {
    tbody.innerHTML = ''; // Bersihkan tulisan "Memuat data..."
    
    if(response.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center">Belum ada data</td></tr>`;
      return;
    }

    // Looping data dari Google Sheets ke dalam tabel
    response.forEach((item, index) => {
      // Format tanggal sederhana
      let tgl = new Date(item.date).toLocaleDateString('id-ID');
      let totalRp = Number(item.total).toLocaleString('id-ID');

      tbody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${tgl}</td>
          <td>${item.item}</td>
          <td>${item.part}</td>
          <td>Rp ${totalRp}</td>
        </tr>
      `;
    });
  } else if (tbody) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Gagal mengambil data database</td></tr>`;
  }
}

// Load halaman otomatis pertama kali
document.addEventListener('DOMContentLoaded', () => {
  loadPage('dashboard');
});
