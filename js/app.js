<script>

function loadPage(page){

  google.script.run

  .withSuccessHandler(function(html){

    document.getElementById("page").innerHTML = html;

    // Trigger load function setelah page dimuat
    setTimeout(() => {
      let loadFunc = window['load' + page.charAt(0).toUpperCase() + page.slice(1)];
      if(typeof loadFunc === 'function'){
        loadFunc();
      }
    }, 100);

  })

  .include(page + '.html');

}

// Default page
window.onload = function(){
  loadPage("dashboard");
}

</script>
