// Get Ad ID from URL function
function getAdIdFromURL()
{
    // get URL after '?'
    var getURL = window.location.search.substring(1);

    // split after '='
    var id = getURL.split('=');

    // id[0] = AD_ID and id[1] = required Ad ID result or Data
    return id[1];   
}

var AD_user_ID;

// View Ad by ID Function
window.addEventListener('load', function viewAd()
{
    const viewAd_div = this.document.querySelector('#viewAd');

    var Ad_Id = getAdIdFromURL();

   if(Ad_Id)
   {
        // Get AD 
        db.collection('ads').doc(Ad_Id).get().then((Ad_Doc) => {

            if(Ad_Doc.exists)
            {
                // Get Ad details from database
                var username;
                var user_Image;
                AD_user_ID = Ad_Doc.data().uid;
                var image1 = Ad_Doc.data().image1;
                var image2 = Ad_Doc.data().image2;
                var image3 = Ad_Doc.data().image3;
                var image4 = Ad_Doc.data().image4;
                var category = Ad_Doc.data().category;
                var condition = Ad_Doc.data().condition;
                var title = Ad_Doc.data().title;
                var details = Ad_Doc.data().description;
                var price = Ad_Doc.data().price;
                var phoneNo = Ad_Doc.data().phoneNo;
                var location = Ad_Doc.data().location;
                var province = Ad_Doc.data().province;
                var date = Ad_Doc.data().date;

                // get Ad owner user Info
                db.collection('users').doc(AD_user_ID).get().then((user_Doc) => { 

                    if(user_Doc.exists)
                    {
                        username = user_Doc.data().username;
                        user_Image = user_Doc.data().image;
                    }

                    viewAd_div.innerHTML = `
                        <div class="col-lg-8">
                            <div class="view-ad-bx">
                                <div id="myCarousel" class="carousel slide" data-interval="false">
                                    <!-- main slider carousel items -->
                                    <div class="carousel-inner">
                                        <div class="active carousel-item" data-slide-number="0">
                                            <img src="${ image1 }" class="img-fluid">
                                        </div>
                                        <div class="carousel-item" data-slide-number="1">
                                            <img src="${ image2 }" class="img-fluid">
                                        </div>
                                        <div class="carousel-item" data-slide-number="2">
                                            <img src="${ image3 }" class="img-fluid">
                                        </div>
                                        <div class="carousel-item" data-slide-number="3">
                                            <img src="${ image4 }" class="img-fluid">
                                        </div>
                                        
                                        <a class="carousel-control-prev" href="#myCarousel" role="button" data-slide="prev">
                                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span class="sr-only">Previous</span>
                                        </a>
                                        <a class="carousel-control-next" href="#myCarousel" role="button" data-slide="next">
                                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span class="sr-only">Next</span>
                                        </a>
                    
                                    </div>
                                    <!-- main slider carousel nav controls -->
                                    <ul class="carousel-indicators list-inline mx-auto border px-2">
                                        <li class="list-inline-item active">
                                            <a id="carousel-selector-0" class="selected" data-slide-to="0" data-target="#myCarousel">
                                                <img src="${ image1 }" class="img-fluid">
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a id="carousel-selector-1" data-slide-to="1" data-target="#myCarousel">
                                                <img src="${ image2 }" class="img-fluid">
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a id="carousel-selector-2" data-slide-to="2" data-target="#myCarousel">
                                                <img src="${ image3 }" class="img-fluid">
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a id="carousel-selector-3" data-slide-to="3" data-target="#myCarousel">
                                                <img src="${ image4 }" class="img-fluid">
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                    
                            <div class="view-ad-bx">
                                <div class="view-details">
                                <h4>Details</h4>
                                <p>Category: ${ category }</p>
                                <p>Condition: ${ condition }</p>
                                </div>
                            </div>
    
                            <div class="view-ad-bx">
                                <div class="view-description">
                                    <h4>Description</h4>
                                    <p>${ details }</p> 
                                </div>
                            </div>
    
                        </div>
    
                        <div class="col-lg-4">
    
                            <div class="view-ad-bx view-ad-pd">
                                <div class="view-price mb-3">
                                <a>${ price }</a>
                                </div>
                                <div class="view-title">
                                <p>${ title }</p>
                                </div>
                                <div style="text-align: right">
                                <a >${ moment(date).format('LL') }</a>
                                </div>
                            </div>
    
                            <div class="view-ad-bx view-ad-pd">
                                <h4>Seller description</h4>
                                <div class="row m-auto">
                                    <div class="view-seller">
                                        <img src="${ user_Image }">
                                    </div>
                                    <div class="mt-3 ml-3">
                                        <div class="view-seller-details">
                                            <a style="text-transform: capitalize;">${ username }</a><br>
                                            <a>${ phoneNo }</a>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-3" id="chat_Del">
                                    
                                </div>
                            </div>
    
                            <div class="view-ad-bx view-ad-pd">
                                <h4>Location</h4>
                                <p>${ province + ", " + location }</p>
                            </div>
    
                        </div>
                    `;


                    var deleteBTN = this.document.querySelector('#chat_Del');

                    // check if owner is view ad show delete button else show chat button
                    auth.onAuthStateChanged( user => { 

                        if(user)
                        {
                            if(AD_user_ID == user.uid)
                            {
                                deleteBTN.innerHTML = `
                                    <button type="button" id="deleteAdBTN" class="btn-danger btn-block btn-no-border" onClick="deleteAd()">Delete This AD</button>
                                `;
                            }
                            else
                            {
                                deleteBTN.innerHTML = `
                                    <button type="button" class="lightBtn btn-block btn-no-border" onClick="gotoChat('${ AD_user_ID }')">Chat With Seller</button>
                                `;
                            }
                        }
                        else
                        {
                            deleteBTN.innerHTML = `
                                <button type="button" class="lightBtn btn-block btn-no-border" onClick="gotoChat('${ AD_user_ID }')">Chat With Seller</button>
                            `;
                        }

                    });
                    
                });
            }
            else
                this.window.location.href = "/404.html";
        });
    }
    else
        this.window.location.href = "/404.html";
});


//Delete Ad Function
function deleteAd()
{
    var Ad_ID = getAdIdFromURL();

    // Disable Button after click
    document.getElementById("deleteAdBTN").disabled = true;

    var deleteAd = document.getElementById("chat_Del");

    deleteAd.innerHTML += `
        <div class="loader">
            <div class="input-group justify-content-center" style="top: 40%; bottom: 40%; position: relative;">
                <div class="spinner-border text-primary" style="width: 5rem;height: 5rem;"></div>
            </div>
        </div>
    `;

    if(Ad_ID)
    {
        if(auth.currentUser)
        {
            if(AD_user_ID == auth.currentUser.uid)
            {
                db.collection('ads').doc(Ad_ID).get().then((Ad_Doc) => {

                    if(Ad_Doc.exists)
                    {
                        // Get Ad images URL from database
                        var image1 = Ad_Doc.data().image1;
                        var image2 = Ad_Doc.data().image2;
                        var image3 = Ad_Doc.data().image3;
                        var image4 = Ad_Doc.data().image4;

                        db.collection("ads").doc(Ad_ID).delete().then(function() {

                            // storage reference
                            let storage = firebase.storage();
        
                            // delete Ad images
                            storage.refFromURL(image1).delete().then(function() {
                                storage.refFromURL(image2).delete().then(function() {
                                    storage.refFromURL(image3).delete().then(function() {
                                        storage.refFromURL(image4).delete().then(function() {
                                            
                                            // After delete Ad redirect to index
                                            window.location.href = "/index.html";

                                        });
                                    });
                                });
                            });

                        });
                    }
                });
            }
        }
    }

    
}


// Go to chat with seller with ID through URL

function gotoChat(ID) 
{
    window.location.href="/chat.html?chat_id=" + String(ID);
}