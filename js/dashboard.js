<script>



function loadDashboard(){



google.script.run

.withSuccessHandler(function(data){



document
.getElementById("totalPurchase")
.innerHTML=

formatMoney(data.totalPurchase);





document
.getElementById("totalDana")
.innerHTML=

formatMoney(data.totalDana);





document
.getElementById("balance")
.innerHTML=

formatMoney(data.balance);




createChart();



})


.getDashboard();



}







function formatMoney(value){


return new Intl.NumberFormat(
"id-ID",
{

style:"currency",

currency:"IDR"

}

)
.format(value);



}






function createChart(){



let ctx =
document
.getElementById(
"purchaseChart"
);



new Chart(ctx,{


type:"bar",


data:{


labels:[

"Jan",
"Feb",
"Mar",
"Apr",
"May"

],



datasets:[{


label:
"Purchasing",


data:[
120,
200,
150,
300,
250
]



}]


},



options:{


responsive:true



}


});



}



</script>
