<script>

function loadPage(page){

  google.script.run

  .withSuccessHandler(function(html){

    document.getElementById("page").innerHTML = html;

  })

  .include(page + '.html');

}

// Default page
window.onload = function(){

  loadPage("dashboard");

}

</script>