// Auth Status check
auth.onAuthStateChanged( user => {

    // if user is login 
    if(user)
    {
        getPushNotificationPermission();
        storeCurrentUserIDAtLocalStorage();
        activeUser();
        accountDetailsAndMessages(user);
        setPostAdUI();
    }
    else
    {
        UnActiveUser();
        defaultAuthenticationUI();
        loginRequired('setAdForm');
    }

});

// Signup
function register() {
    event.preventDefault();

    // Get register form element
    const registerForm = document.querySelector('#register-form');

    // get user Info
    const username = registerForm['registerUsername'].value;
    const email = registerForm['registerEmail'].value;
    const password = registerForm['registerPassword'].value;
    const image = registerForm['registerImageUpload'].value;

    // Get image element
    var profileImage = document.getElementById('upload');

    // Get file
    let imageFile = profileImage.files[0];

    if(username == '' || email == '' || password == '')
        MessageDisplay('#registerMessage', 'alert-danger', 'Please fill out all fields.');

    else if(image == '')
        MessageDisplay('#registerMessage', 'alert-danger', 'Please upload your profile image.');

    else if(imageFile.type.indexOf("image") == -1)
        MessageDisplay('#registerMessage', 'alert-danger', "Select a valid type of image.");

    else
    {
        // Signup the user
        auth.createUserWithEmailAndPassword(email, password).then(cred => {

            // Disable Button after click
            document.getElementById("registerAccountBTN").disabled = true;

            // save user info into user collection with unique ID
            storeUserInfo(cred.user.uid, username, email, imageFile);

        }).catch(err => { 
            MessageDisplay('#registerMessage', 'alert-danger', err.message);
        });
    }
}

// Store user info function
function storeUserInfo(uid, username, email, imageFile) {

    // Get register form element
    const registerForm = document.querySelector('#register-form');

    // Create a storage ref
    let storageRef = firebase.storage().ref('users/' + uid + '/profile/' + image_uID());

    // Upload file
    let task = storageRef.put(imageFile);

    task.on('state_changed',
        function progress(snapshot)
        {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            MessageDisplay('#registerMessage', 'alert-success', "Processing is " + percentage.toFixed(2) + " % done.");
        },
        function error(err){ 
            MessageDisplay('#registerMessage', 'alert-danger', err.message);
        },
        function complete() { 
            task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                
                // store user info
                db.collection("users").doc(uid).set({
                    image: String(downloadURL),
                    username: username,
                    email: email
                }).then(() => {

                    // success message
                    MessageDisplay('#registerMessage', 'alert-success', 'Registration Successfully done.');
                    alert('Registration Successfully done.');

                    // Close Modal form
                    $('#modalForm').modal('hide');

                    // Reset form after submit
                    document.getElementById("profile").style.backgroundImage = "url('../images/imgPlaceholder.png')";
                    registerForm.reset();
                    window.location.reload();
                });

            });
        }
    );       
}

// Login Account
function login() {
    event.preventDefault();

    // Get login form element
    const loginForm = document.querySelector('#login-form');

    // Get login info
    var email = loginForm['loginEmail'].value;
    var password = loginForm['loginPassword'].value;

    if(email == '' || password == '')
        MessageDisplay('#loginMessage', 'alert-danger', 'Please fill out all fields.');
    
    else
    {
        // Login into account
        auth.signInWithEmailAndPassword(email, password).then(cred => {

            MessageDisplay('#loginMessage', 'alert-success', 'Login successfully.');

            // Close Modal form
            $('#modalForm').modal('hide');

            // Reset form after login
            loginForm.reset();

        }).catch( function(err) {
            MessageDisplay('#loginMessage', 'alert-danger', err.message);
        });
    }
}

// Reset Account
function resetAccount() {
    event.preventDefault();

    // Get reset form element
    const resetForm = document.querySelector('#reset-form');
    
    // Get Reset email
    var resetEmail = resetForm['resetEmail'].value;

    // Reset account
    auth.sendPasswordResetEmail(resetEmail).then( function() {
        MessageDisplay('#resetMessage', 'alert-success', 'Password reset email successfully sent to your email.');

    }).catch(function(err) {
        MessageDisplay('#resetMessage', 'alert-danger', err.message);
    });
}

// Logout Account
function logout() {
    auth.signOut().then(() => {

        // Hide Modal Form
        $('#modalForm').modal('hide');

        // Set sentToServer to '0' at Local storage after a user logout
        window.localStorage.setItem("sentToServer", '0');
    });
}

// Sign In with Social websites

//Sign In with Facebook 
function signInWithFB()
{
    var provider = new firebase.auth.FacebookAuthProvider();
    
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;

        // The signed-in user info.
        var user = result.user;

        db.collection('users').doc(user.uid).get().then(doc => {

            if(!doc.exists)
            {
                // store user info
                db.collection("users").doc(user.uid).set({
                    image: user.photoURL,
                    username: user.displayName,
                    email: user.email
                }).then(() => {

                    // Close Modal form
                    $('#modalForm').modal('hide');

                    // Reload form after submit
                    window.location.reload();
                });
                // ...
            }
            else
            {
                // Close Modal form
                $('#modalForm').modal('hide');

                // Reload form after submit
                window.location.reload();
            }
        });
        
    }).catch(function(error) {
    // Handle Errors here.
    });
}

//Sign In with Google 
function signInWithGoogle()
{
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;

        // The signed-in user info.
        var user = result.user;

        db.collection('users').doc(user.uid).get().then(doc => {

            if(!doc.exists)
            {
                // store user info
                db.collection("users").doc(user.uid).set({
                    image: user.photoURL,
                    username: user.displayName,
                    email: user.email
                }).then(() => {

                    // Close Modal form
                    $('#modalForm').modal('hide');

                    // Reload form after submit
                    window.location.reload();
                });
                // ...
            }
            else
            {
                // Close Modal form
                $('#modalForm').modal('hide');

                // Reload form after submit
                window.location.reload();
            }
        });
       
    }).catch(function(error) {
    // Handle Errors here.
    });
}

// All Push Notification related things

// Push notification Ask message
function getPushNotificationPermission()
{
    if(auth.currentUser)
    {
        Notification.requestPermission().then(function () {

            console.log("Notification permission granted.");
            
            if(isTokenSentToServer())
               console.log("Token Already Sent to server.");
            
            else
                getRegisterToken();
    
            })
            .then(function(token) {
            })
            .catch(function (err) {
                console.log("Unable to get permission to notify.");
        });
    }
}

// get register token
function getRegisterToken() 
{
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken().then((currentToken) => {
        if (currentToken) {
            sendTokenToServer(currentToken);
        } else {
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
            setTokenSentToServer(false);
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ');
        setTokenSentToServer(false);
    });
}

//send token to server 
function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
        console.log('Sending token to server...');
        setTokenSentToServer(true);

        // Save token to firestore Database
        db.collection('FCM_Tokens').doc(auth.currentUser.uid).set({
            token: currentToken,
            createdAt: Date.now()
        });

    } else {
        console.log('Token already sent to server so won\'t send it again ' + 'unless it changes');
    }
}

// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(() => {
    messaging.getToken().then((refreshedToken) => {
      console.log('Token refreshed.');
      // Indicate that the new Instance ID token has not yet been sent to the app server.
      setTokenSentToServer(false);
      // Send Instance ID token to app server.
      sendTokenToServer(refreshedToken);
      // ...
    }).catch((err) => {
      console.log('Unable to retrieve refreshed token ');
    });
});


//set token to the server
function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}

// Is token sent to server
function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
}


//Push message
function pushMessages(message, sender)
{
    var currentUser = auth.currentUser.uid;

    db.collection('FCM_Tokens').doc(sender).get().then(FCM_doc => {
        
        if(message && FCM_doc.exists)
        {
            var pushToken = FCM_doc.data().token;

            db.collection('users').doc(currentUser).get().then(user_doc => {

                if(user_doc.exists)
                {
                    var senderName = user_doc.data().username;
                    var senderImage = user_doc.data().image;

                    // Ajax Request to FCM
                    var pushData = {
                        notification: {
                            title: senderName.charAt(0).toUpperCase() + senderName.slice(1),
                            body: message,
                            icon: senderImage,
                            click_action: "https://lets-sell.firebaseapp.com/chat.html?chat_id=" + currentUser
                        },
                        to: pushToken
                    };
                
                    jQuery.ajax({
                        url: 'https://fcm.googleapis.com/fcm/send',
                        method: 'post',
                        contentType: 'application/json',
                        processData: false,
                        dataType: 'json',
                        headers: {
                            Authorization: 'key=AAAAqIFBrX4:APA91bEzcwoVKzEPFiPP0MWZ9XvfUO9cgzprF00i4YuA8BNQkkRzkqHSD5sekIKJG7LRFOO7BUN4tERk63MF1GMuDt4lUDlkTSgIeHvQOD0fcDmfjSdyzTvmNlJNnUdG7fsk8pRMOWWR'
                        },
                        data: JSON.stringify(pushData) 
                    });
                }

            });
        }
    });
}