// Create List Item using REST API
//Function Start

// occurs when a user clicks the create button
function Create() {
    debugger;
    var url = _spPageContextInfo.siteAbsoluteUrl;
    var listName = $('#listName').val();
    var title = $('#Create_Title').val();
    var city = $('#Create_City').val();
    var department = $('#Create_Department').val();
    
    createListItemWithDetails(listName, url, title,city,department, function (data) {
        alert("Item has been created. Updating available items");
        Read();
    }, function (data) {
        console.log(JSON.stringify(data));
        alert("Ooops, an error occured. Please try again");
    });
}
//Function End

//Create List Item with required parameter
//Function Start
// occurs when Create() invoke.

// listName: The name of the list you want to get items from
// url: The url of the site that the list is in. 
// title: The value of the title field for the new item
// city: The value of the city field for the new item
// drpartment: The value of the department field for the new item
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function createListItemWithDetails(listName, url, title,city,department, success, failure) {

    var itemType = GetItemTypeForListName(listName);
    var item = {
        "__metadata": { "type": itemType },
        "Title": title,
        "City": city,
        "Department":department   
    };
    var listUrl=url + "/_api/web/lists/getbytitle('" + listName + "')/items"

    $.ajax({
        url: listUrl,
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(item),
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
}

// Function End.

// Getting the item type for the list
//Function Start

// occurs when createListItemWithDetails() invoke.
function GetItemTypeForListName(name) {
    name=name.trim();
    inSpc= name.indexOf(" ");
    name= name.slice(0,inSpc)+name.slice(inSpc+1);
    return "SP.Data." + name.charAt(0).toUpperCase() + name.slice(1) + "ListItem";   
}

// Function End

//Function to Read list data
// Function Start

// occurs when a user clicks the Read button
function Read() {
    debugger;
    var listName = $('#listName').val();
    var url = _spPageContextInfo.siteAbsoluteUrl;

    //clear both text boxes 
    $('#UpdateTitle').val('');
    $('#Create_Title').val('');    

    getListItems(listName, url, function (data) {
        var items = data.d.results;
        //console.log(JSON.stringify(items) );
        // remove all of the previous items
        $('#UpdateItems option').each(function (index, option) { $(option).remove(); });
        $('#DeleteItems option').each(function (index, option) { $(option).remove(); });
        

        // Add all the new items
        for (var i = 0; i < items.length; i++) {
            $('#UpdateItems').append(new Option(items[i].Title, items[i].Id, false, false));
            $('#DeleteItems').append(new Option(items[i].Title, items[i].Id, false, false));
        }
    }, function (data) {
        console.log(JSON.stringify(data));
        alert("Ooops, an error occured. Please try again");
    });
}
// Function End

// READ operation
// Function occred when getListItems() invoked
//Function Start

// listName: The name of the list you want to get items from
// siteurl: The url of the site that the list is in. 
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function getListItems(listName, siteurl, success, failure) {
    var listUrl=siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items";
    $.ajax({
        url: listUrl, //total item count 100, max. lim. 5000
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
}
//Function End

// Functionality to bind data to text box for update. 
// Function occered when user select value in dropdown

//Function Start
function UpdateSelectedItemChanged() {
    debugger;
 //$('#UpdateTitle').val($('#UpdateItems :selected').text());
     var url = _spPageContextInfo.siteAbsoluteUrl;
     var listName = $('#listName').val();    
     var itemId = $('#UpdateItems').val();
     listUrl=url + "/_api/web/lists/getbytitle('" + listName + "')/items(" + itemId + ")";
     $.ajax({
        url: listUrl,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
          var item=data.d;
        
              $('#UpdateTitle').val(item.Title);
              $('#UpdateCity').val(item.City);
              $('#UpdateDept').val(item.Department);

        
        },
        error: function (data) {
            alert("Unable to get item by ID");

            
        }
        });
}
//Function End

//Update Item
// occurs when a user clicks the update button

//Function Start
function Update() {
    debugger;
    var url = _spPageContextInfo.siteAbsoluteUrl;
    var listName = $('#listName').val();    
    var itemId = $('#UpdateItems').val();
    var title = $('#UpdateTitle').val();
    var city = $('#UpdateCity').val();
    var dept = $('#UpdateDept').val();
    updateListItem(itemId, listName, url, title,city,dept, function () {
        alert("Item updated, refreshing avilable items");
        Read();
    }, function () {
        alert("Ooops, an error occured. Please try again");
    });
}
//Function End

// Update Operation
// Occer when updateListItem() invoked

// Function Start
// listName: The name of the list you want to get items from
// siteurl: The url of the site that the list is in. // title: The value of the title field for the new item
// itemId: the id of the item to update
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function updateListItem(itemId, listName, siteUrl, title,city,dept, success, failure) {
    var itemType = GetItemTypeForListName(listName);

    var item = {
        "__metadata": { "type": itemType },
        "Title": title,
        "City":city,
        "Department":dept
    };

    getListItemWithId(itemId, listName, siteUrl, function (data) {
        $.ajax({
            url: data.__metadata.uri,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "X-HTTP-Method": "MERGE",
                "If-Match": data.__metadata.etag
            },
            success: function (data) {
                success(data);
            },
            error: function (data) {
                failure(data);
            }
        });
    }, function (data) {
        failure(data);
    });
}
// Function End

// READ SPECIFIC ITEM operation

//Function Start
// itemId: The id of the item to get
// listName: The name of the list you want to get items from
// siteurl: The url of the site that the list is in. 
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function getListItemWithId(itemId, listName, siteurl, success, failure) {
    var url = siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items?$filter=Id eq " + itemId;
    $.ajax({
        url: url,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d.results.length == 1) {
                success(data.d.results[0]);
            }
            else {
                failure("Multiple results obtained for the specified Id value");
            }
        },
        error: function (data) {
            failure(data);
        }
    });
}

     
