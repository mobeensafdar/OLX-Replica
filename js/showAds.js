// Show Ads in Index page
window.addEventListener('load', function() {

    var noAdsAvailable = true;

    // Get element
    const freshAd = document.querySelector('#freshRecommendations');
    const showAdsLoader = document.getElementById('showAdsLoader');

    db.collection('ads').orderBy('date', 'desc').get().then((snapshot) => {

        snapshot.forEach(function(doc) {

            if(doc.exists)
            {
                showAdsLoader.innerHTML = "";

                var image = doc.data().image1;
                var title = doc.data().title;
                var details = doc.data().description;
                var price = doc.data().price;
                var location = doc.data().location;
                var date = doc.data().date;
                var AD_ID = doc.id; 

                freshAd.innerHTML += `
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
                                <a>${ moment(date).format('LL') }</a>
                            </div>
                            <div class="ads-view">
                                <button type="button" class="btn btn-primary btn-block" onClick="gotoViewAd('${ AD_ID }')">VIEW DETAILS</button>
                            </div>
                        </div>
                    </div>
                `;

                noAdsAvailable = false;
            }
        });


        if(noAdsAvailable == true)
        {
            $("#freshRecommendations").removeClass("row");

            $("#freshTitle").text("");

            showAdsLoader.innerHTML = "";

            freshAd.className = "";
            freshAd.innerHTML = `
                <div class="text-center text-danger mt-3">
                    <h3><b>Oops! Currently no Ads available to show.<b></h3>
                </div>
            `;
        }
        else
            $("#freshTitle").text("Fresh Recommendations");

    });
});

// Goto view Ad with AD ID through URL
function gotoViewAd(ID){
    window.location.href = "/view_ads.html?ad_id=" + String(ID);
}