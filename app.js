// GANTI DENGAN WEB APP URL DARI GOOGLE APPS SCRIPT ANDA
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyT64VA9XjKLiLRfY8hEzq8po--RDIPlklg16hfW8AlDJ5gP1nN9tRaW4xv2nQFsDbO/exec"; 

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
