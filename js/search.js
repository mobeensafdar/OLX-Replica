// Get search string  from URL function
function getSearchTextFromURL()
{
    // get URL after '?'
    var getURL = window.location.search.substring(1);

    // split after '='
    var splitText = getURL.split('=');

    if(splitText != undefined && splitText.length == 4 )  
    {
        // split after '?'
        var location = splitText[1].split('?');
        var category = splitText[2].split('?');
        var searchText = splitText[3].split('?');

        return {
            location: location[0],
            category: category[0],
            text: searchText[0]
        }; 
    }
    else
        window.location.href = "/404.html";
}

// After page window load
window.addEventListener('load', () => {
   
    var isNoSearchResult = true;
    
    var adsCounter = 0;

    var location = getSearchTextFromURL().location;
    var category = getSearchTextFromURL().category;
    var searchText = getSearchTextFromURL().text;

    // set DOM input value
    document.getElementById('searchLocation').value = location;
    document.getElementById('searchCategory').value = category;
    document.getElementById('searchText').value = searchText;

    if(location && category && searchText)
    {
        // Get element
        const searchResults = document.querySelector('#searchResults');
        const searchAdsLoader = document.getElementById("searchAdsLoader");

        var resultDoc = db.collection('ads').orderBy("title").startAt(searchText.toLowerCase()).endAt(searchText.toLowerCase() + "\uf8ff");

        // for all loction and all category
        if(location == "AllLocations" && category == "AllCategories")
        {
            resultDoc.get().then((snapshot) => {

                snapshot.forEach(function(doc) {

                    if(doc.exists)
                    {
                        searchAdsLoader.innerHTML = "";

                        var image = doc.data().image1;
                        var title = doc.data().title;
                        var details = doc.data().description;
                        var price = doc.data().price;
                        var location = doc.data().location;
                        var date = doc.data().date;
                        var AD_ID = doc.id; 
        
                        searchResults.innerHTML += `
                            <div class="col-lg-3">
                                <div class="ads-box">
                                    <img src="${ image }">
                                    <div class="ads-title">
                                        <a style="text-transform: capitalize">${ title }</a>
                                    </div>
                                    <div class="ads-details">
                                        <a>${ details }</a>
                                    </div>
                                    <div class="ads-price">
                                        <a>${ price }</a>
                                    </div>
                                    <div class="ads-location-date">
                                        <a>${ location }</a><br>
                                        <a style="text-align: right">${ moment(date).format('LL') }</a>
                                    </div>
                                    <div class="ads-view">
                                        <button type="button" class="btn btn-primary btn-block" onClick="gotoViewAd('${ AD_ID }')">VIEW DETAILS</button>
                                    </div>
                                </div>
                            </div>
                        `;

                        adsCounter++;
                        isNoSearchResult = false;
                    }
                });

                if(isNoSearchResult == true)
                {
                    $("#searchResults").removeClass("row");

                    $("#searchTitle").text("");

                    searchAdsLoader.innerHTML = "";

                    searchResults.innerHTML = `
                        <div class="text-center text-danger mt-3">
                            <img src="images/noResultsFound.png" style="max-width: 100%">
                            <h3><b>Oops... we didn't find anything that matches this search.<b></h3>
                            <p>Try search for something more general, change the filters or check for spelling mistakes.</p>
                        </div>
                    `;
                }
                else
                    $("#searchTitle").html(`Search found <b>${ adsCounter }</b> results for <b>All Categories</b> : <b class="text-danger">"${ searchText }"</b> in <b>All Locations</b>.`);

            });
        }

        // for when location equals to all locations
        else if(location == "AllLocations")
        {
            resultDoc.where("category", "==", category).get().then((snapshot) => {

                snapshot.forEach(function(doc) {
        
                    if(doc.exists)
                    {
                        searchAdsLoader.innerHTML = "";

                        var image = doc.data().image1;
                        var title = doc.data().title;
                        var details = doc.data().description;
                        var price = doc.data().price;
                        var location = doc.data().location;
                        var date = doc.data().date;
                        var AD_ID = doc.id; 
        
                        searchResults.innerHTML += `
                            <div class="col-lg-3">
                                <div class="ads-box">
                                    <img src="${ image }">
                                    <div class="ads-title">
                                        <a style="text-transform: capitalize">${ title }</a>
                                    </div>
                                    <div class="ads-details">
                                        <a>${ details }</a>
                                    </div>
                                    <div class="ads-price">
                                        <a>${ price }</a>
                                    </div>
                                    <div class="ads-location-date">
                                        <a>${ location }</a><br>
                                        <a style="text-align: right">${ moment(date).format('LL') }</a>
                                    </div>
                                    <div class="ads-view">
                                        <button type="button" class="btn btn-primary btn-block" onClick="gotoViewAd('${ AD_ID }')">VIEW DETAILS</button>
                                    </div>
                                </div>
                            </div>
                        `;

                        adsCounter++;
                        isNoSearchResult = false;
                    }
                });

                if(isNoSearchResult == true)
                {
                    $("#searchResults").removeClass("row");

                    $("#searchTitle").text("");

                    searchAdsLoader.innerHTML = "";

                    searchResults.innerHTML = `
                        <div class="text-center text-danger mt-3">
                            <img src="images/noResultsFound.png" style="max-width: 100%">
                            <h3><b>Oops... we didn't find anything that matches this search.<b></h3>
                            <p>Try search for something more general, change the filters or check for spelling mistakes.</p>
                        </div>
                    `;
                }
                else
                    $("#searchTitle").html(`Search found <b>${ adsCounter }</b> results for <b>${ category }</b> : <b class="text-danger">"${ searchText }"</b> in <b>All Locations</b>.`);

            });
        }

        // for when category equals to all category
        else if(category == "AllCategories")
        {
            resultDoc.where("province", "==", location).get().then((snapshot) => {

                snapshot.forEach(function(doc) {
        
                    if(doc.exists)
                    {
                        searchAdsLoader.innerHTML = "";

                        var image = doc.data().image1;
                        var title = doc.data().title;
                        var details = doc.data().description;
                        var price = doc.data().price;
                        var location = doc.data().location;
                        var date = doc.data().date;
                        var AD_ID = doc.id; 
        
                        searchResults.innerHTML += `
                            <div class="col-lg-3">
                                <div class="ads-box">
                                    <img src="${ image }">
                                    <div class="ads-title">
                                        <a style="text-transform: capitalize">${ title }</a>
                                    </div>
                                    <div class="ads-details">
                                        <a>${ details }</a>
                                    </div>
                                    <div class="ads-price">
                                        <a>${ price }</a>
                                    </div>
                                    <div class="ads-location-date">
                                        <a>${ location }</a><br>
                                        <a style="text-align: right">${ moment(date).format('LL') }</a>
                                    </div>
                                    <div class="ads-view">
                                        <button type="button" class="btn btn-primary btn-block" onClick="gotoViewAd('${ AD_ID }')">VIEW DETAILS</button>
                                    </div>
                                </div>
                            </div>
                        `;

                        adsCounter++;
                        isNoSearchResult = false;
                    }
                });

                if(isNoSearchResult == true)
                {
                    $("#searchResults").removeClass("row");

                    $("#searchTitle").text("");

                    searchAdsLoader.innerHTML = "";

                    searchResults.innerHTML = `
                        <div class="text-center text-danger mt-3">
                            <img src="images/noResultsFound.png" style="max-width: 100%">
                            <h3><b>Oops... we didn't find anything that matches this search.<b></h3>
                            <p>Try search for something more general, change the filters or check for spelling mistakes.</p>
                        </div>
                    `;
                }
                else
                    $("#searchTitle").html(`Search found <b>${ adsCounter }</b> results for <b>All Categories</b> : <b class="text-danger">"${ searchText }"</b> in <b>${ location }</b>.`);

            });
        }
        else 
        {
            resultDoc.where("province", "==", location).where("category", "==", category).get()
            .then((snapshot) => {

                snapshot.forEach(function(doc) {
        
                    if(doc.exists)
                    {
                        searchAdsLoader.innerHTML = "";

                        var image = doc.data().image1;
                        var title = doc.data().title;
                        var details = doc.data().description;
                        var price = doc.data().price;
                        var location = doc.data().location;
                        var date = doc.data().date;
                        var AD_ID = doc.id; 
        
                        searchResults.innerHTML += `
                            <div class="col-lg-3">
                                <div class="ads-box">
                                    <img src="${ image }">
                                    <div class="ads-title">
                                        <a style="text-transform: capitalize">${ title }</a>
                                    </div>
                                    <div class="ads-details">
                                        <a>${ details }</a>
                                    </div>
                                    <div class="ads-price">
                                        <a>${ price }</a>
                                    </div>
                                    <div class="ads-location-date">
                                        <a>${ location }</a><br>
                                        <a style="text-align: right">${ moment(date).format('LL') }</a>
                                    </div>
                                    <div class="ads-view">
                                        <button type="button" class="btn btn-primary btn-block" onClick="gotoViewAd('${ AD_ID }')">VIEW DETAILS</button>
                                    </div>
                                </div>
                            </div>
                        `;

                        adsCounter++;
                        isNoSearchResult = false;
                    }                  
                });

                if(isNoSearchResult == true)
                {
                    $("#searchResults").removeClass("row");

                    $("#searchTitle").text("");

                    searchAdsLoader.innerHTML = "";

                    searchResults.innerHTML = `
                        <div class="text-center text-danger mt-3">
                            <img src="images/noResultsFound.png" style="max-width: 100%">
                            <h3><b>Oops... we didn't find anything that matches this search.<b></h3>
                            <p>Try search for something more general, change the filters or check for spelling mistakes.</p>
                        </div>
                    `;
                }
                else
                    $("#searchTitle").html(`Search found <b>${ adsCounter }</b> results for <b>${ category }</b> : <b class="text-danger">"${ searchText }"</b> in <b>${ location }</b>.`);

            });
        }
    }
    else
    {
        window.location.href = "/404.html";
    }
});

// Goto view Ad with AD ID through URL
function gotoViewAd(ID) {
    window.location.href="/view_ads.html?ad_id=" + String(ID);
}