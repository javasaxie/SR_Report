<script>

window.loadPage = function(page) {
  console.log("Loading page:", page);
  
  google.script.run
    .withSuccessHandler(function(html) {
      console.log("Page loaded:", page);
      document.getElementById("page").innerHTML = html;
      
      // Auto-trigger the load function if it exists
      setTimeout(() => {
        let funcName = 'load' + page.charAt(0).toUpperCase() + page.slice(1);
        if (window[funcName] && typeof window[funcName] === 'function') {
          console.log("Calling:", funcName);
          window[funcName]();
        }
      }, 100);
    })
    .withFailureHandler(function(err) {
      console.error("Error:", err);
      document.getElementById("page").innerHTML = "<p style='color:red;'>Error: " + err + "</p>";
    })
    .include(page + '.html');
};

document.addEventListener('DOMContentLoaded', function() {
  loadPage('dashboard');
});

</script>