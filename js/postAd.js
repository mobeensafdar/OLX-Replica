// Post an Ad function
function postAd() {
    event.preventDefault();

    // get post ad form element 
    const postAdForm = document.querySelector('#postAd-form');

    // get user UID
    const user_UID = auth.currentUser.uid;

    // Get Ad details
    const category = postAdForm['postAdCategory'].value;
    const condition = postAdForm['postAdCondition'].value;
    const title = postAdForm['postAdTitle'].value;
    const description = postAdForm['postAdDescription'].value;
    const price = postAdForm['postAdPrice'].value;
    const location = postAdForm['postAdLocation'].value;
    const province = postAdForm['postAdProvince'].value;
    const phoneNo = postAdForm['postAdPhone'].value;
    const date = Date.now();

    // Get image element
    var image1 = document.getElementById('postAdImage1');
    var image2 = document.getElementById('postAdImage2');
    var image3 = document.getElementById('postAdImage3');
    var image4 = document.getElementById('postAdImage4');

    if(category == '' || condition == '' || title == '' || description == '' || 
        price == '' || location == '' || province == 'Select province' || phoneNo == '')
    {
        MessageDisplay('#postAdMessage' ,'alert-danger' ,"Please fill out all fields.");
    }

    else if(image1.value == '' || image2.value == '' || image3.value == '' || image4.value == '')
        MessageDisplay('#postAdMessage' ,'alert-danger' ,"Please select all images.");

    else
    {
        if(user_UID)
        {
            // Get image files
            let imageFile1 = image1.files[0];
            let imageFile2 = image2.files[0];
            let imageFile3 = image3.files[0];
            let imageFile4 = image4.files[0];

            if(imageFile1.type.indexOf("image") == -1 || imageFile2.type.indexOf("image") == -1 || imageFile3.type.indexOf("image") == -1 || imageFile4.type.indexOf("image") == -1)
            {
                MessageDisplay('#postAdMessage', 'alert-danger', "Please select valid type of images.");
            }
            else
            {
                // Disable button
                document.getElementById('postNowAdBTN').disabled = true;

                // Array with all images file
                let allImages = [imageFile1, imageFile2, imageFile3, imageFile4];

                // Array for store upload image URL
                var imagesURL = new Array();

                for(var i = 0; i < allImages.length; i++)
                {
                    UploadImagesAndGetImagesURL(allImages[i]).then(UploadImageURL => {
                        imagesURL.push(UploadImageURL.imageURL);
                        
                        if(imagesURL.length == 4)
                        {
                            // store ad info into database
                            db.collection("ads").add({
                                uid: user_UID,
                                category: category,
                                condition: condition,
                                title: title.toLowerCase(),
                                description: description,
                                price: "Rs " + price,
                                image1: imagesURL[0],
                                image2: imagesURL[1],
                                image3: imagesURL[2],
                                image4: imagesURL[3],
                                location: location,
                                province: province,
                                phoneNo: phoneNo,
                                date: date
                            }).then(docRef => {

                                // success message
                                MessageDisplay('#postAdMessage', 'alert-success', 'Post Ad Successfully done.');
                                
                                // Reset Form Fields
                                postAdForm.reset();
                                window.location.href = "/view_ads.html?ad_id=" + docRef.id;

                            });
                        }
                    });
                    
                }
            }

        }
        else
            MessageDisplay('#postAdMessage', 'alert-danger', "Please login first to post an Ad.");
    }
}

// Upload Ad images
function UploadImagesAndGetImagesURL(imageFile)
{
    return new Promise((resolve, reject) => {
        
        // get user UID
        const user_UID = auth.currentUser.uid;

        // Create a storage ref
        let storageRef = firebase.storage().ref('users/' + user_UID + '/Ads_Images/' + image_uID());

        // Upload file
        let task = storageRef.put(imageFile);

        var imageURL;

        task.on('state_changed',
            function progress(snapshot)
            {
                let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                
                var postAdMessage = document.getElementById("postAdMessage");

                postAdMessage.innerHTML = `
                    <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" ></div>
                `;
            },
            function error(err){ 
                MessageDisplay('#postAdMessage', 'alert-danger', err.message);
            },
            function complete() { 
                task.snapshot.ref.getDownloadURL().then(function(downloadURL) {

                    imageURL = {
                       imageURL: downloadURL
                    }

                    resolve(imageURL);

                    return imageURL;
                });
            }
        );

    });
}

window.onbeforeunload = function() {

    if(document.getElementById('postNowAdBTN').disabled != true)
    {
        return 'Are you sure you want to leave?';
    }
};