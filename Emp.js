$(document).ready(function() {
    Read();
});

function Read() {
    
    $.ajax({  
       url: _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/GetByTitle('Employee')/items",  
        method: "GET",  
        headers: { "Accept": "application/json;odata=verbose"}, 
        success: function(data){
         
            var items=data.d.results;
            for(var i=0;i<items.length;i++){
         $("#employeeTbale").append("<tr><td>"+items[i].Title+"</td><td>"+items[i].City+"</td><td>"+items[i].Department+"</td></tr>");

          $('#title').append(new Option(items[i].Title));
           $('#city').append(new Option(items[i].City));
            $('#dep').append(new Option(items[i].Department));

            }
        

        } ,
        error:function (data){
            alert(JSON.stringify(data));
        }
});
}

$("#title").change(function() {
    var value = $(this).val().toLowerCase();
    $("#employeeTbale tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});



$("#city").change(function() {
    var value = $(this).val().toLowerCase();
    $("#employeeTbale tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

$("#dep").change(function() {
    var value = $(this).val().toLowerCase();
    $("#employeeTbale tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});




