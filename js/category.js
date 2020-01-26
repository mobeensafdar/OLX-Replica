// Get category from URL function
function getCategoryFromURL()
{
    // get URL after '?'
    var getURL = window.location.search.substring(1);

    // split after '='
    var category = getURL.split('=');

    // category[0] = category and category[1] = category name
    return category[1];   
}


// After page window load
window.addEventListener('load', () => {

    var category = getCategoryFromURL();

    var isNoCategoryResult = true;

    var adsCounter = 0;

    if(category)
    {
        // get elements
        const categoryResults = document.getElementById("categoryResults");
        const categoryAdsLoader = document.getElementById("categoryAdsLoader");

        db.collection('ads').orderBy('date', 'desc').where("category", "==", category).get().then((snapshot) => {

            snapshot.forEach(function(doc) {
    
                if(doc.exists)
                {
                    categoryAdsLoader.innerHTML = "";

                    var image = doc.data().image1;
                    var title = doc.data().title;
                    var details = doc.data().description;
                    var price = doc.data().price;
                    var location = doc.data().location;
                    var date = doc.data().date;
                    var AD_ID = doc.id; 
                        
                    categoryResults.innerHTML += `
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
                    isNoCategoryResult = false;
                }
            });

            
            if(isNoCategoryResult == true)
            {
                $("#categoryResults").removeClass("row");

                $("#categoryTitle").text("");
                
                categoryAdsLoader.innerHTML = "";

                categoryResults.innerHTML = `
                    <div class="text-center text-danger mt-3">
                        <img src="images/noResultsFound.png" style="max-width: 100%">
                        <h3><b>Oops... we didn't find any Ad that matches this category.<b></h3>
                        <p>No Ads are available for this category at these time.</p>
                    </div>
                `;
            }
            else
                $("#categoryTitle").html(`<b> ${ adsCounter } </b> Ads in <b class="text-danger"> ${ category } </b>`);

        });  
    }
    else
        window.location.href = "/404.html";

});

// Goto view Ad with AD ID through URL
function gotoViewAd(ID) {
    window.location.href="/view_ads.html?ad_id=" + String(ID);
}