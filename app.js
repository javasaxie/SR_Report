// GANTI DENGAN WEB APP URL DARI GOOGLE APPS SCRIPT ANDA
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyT64VA9XjKLiLRfY8hEzq8po--RDIPlklg16hfW8AlDJ5gP1nN9tRaW4xv2nQFsDbO/exec"; 

// 1. Fungsi Routing Halaman (Memanggil file HTML statis di GitHub)
window.loadPage = async function(page) {
  const pageContainer = document.getElementById("page");
  pageContainer.innerHTML = `<div class="spinner-border text-primary"></div> Memuat...`;

  try {
    // Memanggil file .html yang ada di repo github yang sama
    const response = await fetch(page + '.html'); 
    
    if (!response.ok) throw new Error("Halaman tidak ditemukan (404)");
    
    const htmlContent = await response.text();
    pageContainer.innerHTML = htmlContent;

    // Otomatis jalankan fungsi init sesuai nama halaman jika ada
    let initFunctionName = 'init' + page.charAt(0).toUpperCase() + page.slice(1);
    if (typeof window[initFunctionName] === 'function') {
      window[initFunctionName]();
    }

  } catch (error) {
    pageContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
};

// 2. Fungsi Komunikasi API ke Google Sheets
window.callAPI = async function(action, data = null) {
  try {
    const response = await fetch(GAS_API_URL, {
      method: 'POST',
      // Menggunakan text/plain penting untuk mencegah preflight error CORS di Apps Script
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

// Load halaman default
document.addEventListener('DOMContentLoaded', () => {
  loadPage('dashboard');
});
