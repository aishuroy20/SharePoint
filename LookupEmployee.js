//   function Read() {
//             var fromDate = $("#fromDate").val();
//             var toDate = $("#toDate").val();
            
//             var odataVal = "?$filter=ID gt 0"; 
            
            
//             odataVal += ($("#fromDate").val() && $("#toDate").val()) ? " and DateOfJoining ge '" + fromDate + "' and DateOfJoining le '" + toDate + "'" : "";
//             odataVal += ($("#title").val() && $("#title").val() != "Title") ? " and Title eq '" + $("#title").val() + "'" : "";
//             odataVal += ($("#city").val() && $("#city").val() != "City") ? " and City eq '" + $("#city").val() + "'" : "";
//             odataVal += ($("#state").val() && $("#state").val() != "Department") ? " and Department eq '" + $("#state").val() + "'" : "";
//             odataVal += ($("#city").val() && $("#city").val() != "City") ? " and City eq '" + $("#city").val() + "'" : "";
//             odataVal += ($("#country").val() && $("#country").val() != "Country") ? " and Country eq '" + $("#country").val() + "'" : "";
//             odataVal += ($("#dateofjoining").val() && $("#dateofjoining").val() != "DateOfJoining") ? " and DateOfJoining eq '" + $("#dateofjoining").val() + "'" : "";

//               odataVal += ($("#dateofbirth").val() && $("#dateofbirth").val() != "DateOfBirth") ? " and DateOfBirth eq '" + $("#dateofbirth").val() + "'" : "";

//                 odataVal += ($("#age").val() && $("#age").val() != "Age") ? " and Age eq '" + $("#age").val() + "'" : "";
            
            
//             odataVal += "&$expand=City, Country, State";

//             $('#tblEmployee tbody').empty();

//             $.ajax({
//                 url: _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('LookupEmployee')/items" + odataVal,
//                 method: "GET",
//                 headers: { "Accept": "application/json;odata=verbose" },
//                 success: function (data) {
//                     var items = data.d.results;
//                     for (var i = 0; i < items.length; i++) {
//                         $("#tblEmployee tbody").append("<tr><td>" + items[i].Title + "</td><td>" + items[i].City + "</td><td>" + items[i].City.City_x003a__x0020_State + "</td><td>" + items[i].City.City_x003a__x0020_Country + "</td><td>" + items[i].DateOfJoinng + "</td><td>" + items[i].DateOfBirth + "</td><td>" + items[i].Age + "</td></tr>");
//                     }
//                 },
//                 error: function (data) {
//                     alert(JSON.stringify(data));
//                  }
//             });
//         }

//         Read();


$(document).ready(function(){
    Read();
})

var fromDate="";
var toDate="";
var odataVal="";
function Read() {
    debugger;
    
    ////// from date and to date and also for all the filters //////////////////////////////////////////////
        if($("#fromDate").val() !="" && $("#toDate").val() !="")
        {
            odataVal="";
            fromDate = formatUTCDates($("#fromDate").val());
            toDate = formatUTCDates($("#toDate").val());
            odataVal =(fromDate && toDate) ? " and DateOfJoinng ge '" + fromDate + "' and DateOfJoinng le '" + toDate + "'" : "";
        }

        /////////// To filter  By state ////////////////////////////////////////////////////////////////////////////
     
     odataVal += ($("#state").val() == "0" ? "" : " and City/State eq '" + $("#state").val() + "'");
 
  
var empty="";
    $.ajax({
        url:  _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('LookupEmployee')/items?$select= Title,City/Title,City/State,City/Country,DateOfJoinng,DateOfBirth,Age&$expand= City&$filter=ID gt 0" + odataVal,
        method: "GET",
        headers: { "Accept": "application/json;odata=verbose"},
        success: function (data) {
            var items = data.d.results;
              
             for (var i = 0; i < items.length; i++){
                empty+= "<tr><td>" + items[i].Title + "</td><td>" + items[i].City.Title + "</td><td>" + items[i].City.State + "</td><td>" + items[i].City.Country + "</td><td>" +formatDate(items[i].DateOfJoinng )+ "</td><td>" +formatDate( items[i].DateOfBirth) + "</td><td>" + items[i].Age + "</td></tr>";
                    }
                    $("#tblEmployee tbody").html(empty);
                },
        
        error: function (data) {
            alert(JSON.stringify(data));
        }
    });
}

////// To remove the time from the list date table ////////////////////////////////////////////////////////////////////////////////////////
function formatDate(dateString) {
    if (!dateString) return ""; 
    var date = new Date(dateString);
  
   // var formattedDate = (Number(date.getMonth())+1) + '/' +date.getDate()+ '/' + date.getFullYear();
    var formattedDate = (date.getDate() + '-' +(Number(date.getMonth())+1) + '-' +date.getFullYear()) ;
    return formattedDate;
}


////////////////// To Get Utc Format (  yyyy-mm-dd:THH:MM:SSz utc date format ) ///////////////////////////////////////////////////////////////////////////////////

function formatUTCDates(dateString){
    if (!dateString) return ""; 
    var date = new Date(dateString);
  
   // var formattedDate = (Number(date.getMonth())+1) + '/' +date.getDate()+ '/' + date.getFullYear();
    var formattedDate = (date.getFullYear() + '-' +(Number(date.getMonth())+1) + '-' +date.getDate()+"T00:00:00z") ;   
    return formattedDate;
}




////////////////////////////////////////  Get all day filter(All,Today,Yesterday,Last Week,Last Month,Last 3 Month) ///////////////////////////////////////////////////////
function getAllDayData(){
    debugger;
 var data = $("#allData").val();
 var fromDates;
    odataVal="";
     toDates = new Date();
     toDate=(Number(toDates.getMonth())+1)+"/"+(Number(toDates.getDate()))+"/"+toDates.getFullYear(); 
switch(parseInt(data)){

  case 0:  // All
            fromDate = "";
            toDate = "";
            odataVal = $("#allData").val() == "0" ? "" : " and DateOfJoinng ge '" + fromDate + "' and DateOfJoinng le '" + toDate;
           
            break;

    case 1:   // Today
     fromDates = new Date(); 
     fromDate=(Number(fromDates.getMonth())+1) +"/"+(Number(fromDates.getDate()))+"/"+fromDates.getFullYear();
     odataVal = $("#allData").val() == "1" ? " and DateOfJoinng ge '" + fromDate + "' and DateOfJoinng le '" + toDate + "'" : "";
            
     break;

    case 2: // Yesterday
     var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            fromDate =(Number(yesterday.getMonth())+1)+"/"+(Number(yesterday.getDate()))+"/"+ yesterday.getFullYear();
            odataVal += $("#allData").val() == "2" ? " and DateOfJoinng eq '" + fromDate + "'" : "";
           
     
            break;

     case 3: //Last Week
            fromDates = new Date();
            fromDates.setDate(fromDates.getDate() - 7);
            fromDate=(Number(fromDates.getMonth())+1) +"/"+(Number(fromDates.getDate()))+"/"+fromDates.getFullYear();
             odataVal += $("#allData").val() == "3" ? " and DateOfJoinng ge '" + fromDate + "' and DateOfJoinng le '" + toDate + "'" : "";
           
            break;

    case 4:   //Last Month
            fromDates = new Date();
            fromDates.setMonth(fromDates.getMonth() - 1); 
            fromDate=(Number(fromDates.getMonth())+1) +"/"+(Number(fromDates.getDate()))+"/"+fromDates.getFullYear();
             odataVal += $("#allData").val() == "4" ? " and DateOfJoinng ge '" + fromDate + "' and DateOfJoinng le '" + toDate + "'" : "";
            
            break;

     case 5:  //last 3 months
            fromDates = new Date();
            fromDates.setMonth(fromDates.getMonth() - 3);
           fromDate=(Number(fromDates.getMonth())+1) +"/"+(Number(fromDates.getDate()))+"/"+fromDates.getFullYear();
            odataVal += $("#allData").val() == "5" ? " and DateOfJoinng ge '" + fromDate + "' and DateOfJoinng le '" + toDate + "'" : "";
            break;
}
}

