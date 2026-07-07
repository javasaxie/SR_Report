<script>

// Define loadPage globally before anything else
window.loadPage = function(page){

  console.log("Loading page:", page);

  google.script.run

  .withSuccessHandler(function(html){

    console.log("Success loading:", page, "HTML length:", html ? html.length : 0);

    document.getElementById("page").innerHTML = html;

    // Cek apakah ada function load untuk halaman tersebut
    setTimeout(() => {
      let funcName = 'load' + page.charAt(0).toUpperCase() + page.slice(1);
      console.log("Checking for function:", funcName);
      if(window[funcName] && typeof window[funcName] === 'function'){
        console.log("Found function, calling it...");
        window[funcName]();
      } else {
        console.log("Function not found:", funcName);
      }
    }, 200);

  })

  .withFailureHandler(function(err){
    console.error("Error loading page:", err);
    document.getElementById("page").innerHTML = "<div style='padding: 20px; color: red;'><h3>Error Loading Page</h3><p>" + err + "</p></div>";
  })

  .include(page + '.html');

};

// Load default page
window.addEventListener('DOMContentLoaded', function(){
  console.log("DOM Content Loaded, loadPage defined:", typeof window.loadPage);
  if(window.loadPage){
    loadPage("dashboard");
  }
});

console.log("app.js loaded successfully");

</script>