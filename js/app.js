<script>

// Define loadPage globally before anything else
window.loadPage = function(page){

  google.script.run

  .withSuccessHandler(function(html){

    document.getElementById("page").innerHTML = html;

    // Cek apakah ada function load untuk halaman tersebut
    setTimeout(() => {
      let funcName = 'load' + page.charAt(0).toUpperCase() + page.slice(1);
      if(window[funcName] && typeof window[funcName] === 'function'){
        window[funcName]();
      }
    }, 200);

  })

  .withFailureHandler(function(err){
    console.error("Error loading page:", err);
  })

  .include(page + '.html');

};

// Load default page
window.addEventListener('DOMContentLoaded', function(){
  if(window.loadPage){
    loadPage("dashboard");
  }
});

</script>