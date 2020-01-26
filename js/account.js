const accountModal = document.querySelector('#modalForm');

// Account Details and messages on Modal form
const accountDetailsAndMessages = (user) => {
    if(user) 
    {    
        // Declare account details variables
        var username, email, profileimage;

        db.collection('users').doc(user.uid).get().then(doc => {
            
            if(doc.exists)
            {
                // Get account details from firestore
                username = doc.data().username;
                email = doc.data().email;
                profileimage = doc.data().image;

                // Rename to Account
                $("#loginAccountBtn").text('Account');
                document.getElementById('loginAccountBtn').style.display = "";

                // setup account details UI
                accountModal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                    <div class="modal-header modal-header-bg text-center">
                        <ul class="nav pills nav-justified">
                            <li class="pills-adjust">
                            <a class="nav-link lightBtn" data-toggle="tab" href="#accountDetailsTab">Profile</a>
                            </li>
                            <li class="pills-adjust">
                            <a class="nav-link lightBtn" data-toggle="tab" href="#messagesTab">Messages</a>
                            </li>
                        </ul>
                    </div>
                        <div class="modal-body">
                            <div class="tab-content container">

                                <div id="accountDetailsTab" class="tab-pane fade in active show">

                                    <div class="text-center" style="color: #444">
                                        <h4>Account Details</h4>
                                    </div>

                                    <div class="divider">
                                    </div>

                                    <div class="text-center mb-3">
                                        <img class="ProfilePreview" style="position: relative" src="${ profileimage }">
                                    </div>
                                    <div class="text-center mb-3" style="overflow: overlay">         
                                        <table class="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <td><b class="text-primary">Username</b></td>
                                                    <td style="text-transform: capitalize">${ username }</td>
                                                </tr>
                                                <tr>
                                                    <td><b class="text-primary">Email</b></td>
                                                    <td>${ email }</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="input-group mb-3">
                                        <button class="btn-danger btn-block btn-no-border" onClick="logout()">Log out</button>
                                    </div>

                                </div>

                                <div id="messagesTab" class="tab-pane fade">
                                    <div class="text-center mb-3" style="color: #444">
                                        <h4>Messages</h4>
                                    </div>

                                    <div class="messagesModal mb-3">
                                        <div id="noMessages"></div>
                                        <div id="messagesShowOnTab"></div>
                                    </div>
                                    

                                </div>
                            </div>
                        </div>
                        <div class="modal-footer modal-footer-bg">
                            <div class="modal-footer-close"> 
                                <button type="button" class="lightBtn btn-block btn-no-border" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;

                MessagesShowOnModal(); 
            }

        }).catch(function(err) {
            console.log(err.message);
        });
    }
}

// Show Messages on modal messages Tab
function MessagesShowOnModal()
{
    var currentUserID = auth.currentUser.uid;

    var messageTabDiv = document.getElementById("messagesShowOnTab");
    var noMessagesDiv = document.getElementById("noMessages");

    db.collection("chatRooms").where(`users.${currentUserID}`, "==", true)
    .onSnapshot(function(Snapshot) {

        noMessagesDiv.innerHTML = `
            <div class="text-center mt-3 mb-3">
                <img src="images/noMessage.png">
                <h5 class="mt-3"><b>You have no Messages</b></h5>
                <p>Your inbox is empty. Send messages to get started.</p>
            </div>
        `;

        messageTabDiv.innerHTML = ``;
        
        Snapshot.forEach(function(room) {

            if(room.exists)
            {  
                var chatroomUsersID = Object.keys(room.data().users);

                if(chatroomUsersID[0] == currentUserID)
                {
                    db.collection("users").doc(chatroomUsersID[1]).get().then(function(roomUser) {
                        var roomUserName = roomUser.data().username; 
                        var roomUserImage = roomUser.data().image;

                        noMessagesDiv.innerHTML = ``;

                        // Add chat room on messages tab modal
                        messageTabDiv.innerHTML += `
                            <div class="chat-history" onClick="gotoChatRoom('${ chatroomUsersID[1] }')">
                                <div class="chat-with">
                                    <img class="chat-profile" src="${ roomUserImage }">
                                    <div class="chat-wrap pl-3x">
                                        <a style="text-transform: capitalize" class="bold-txt">${ roomUserName }</a><br>
                                        <a>${ room.data().lastMessage }</a><br>
                                        <a class="chat-time">${ moment(room.data().lastMessageDate).format('hh:mm a')}</a>
                                    </div>
                                </div>
                            </div>
                        `;

                    });
                }
                else
                {
                    db.collection("users").doc(chatroomUsersID[0]).get().then(function(roomUser) {
                        var roomUserName = roomUser.data().username; 
                        var roomUserImage = roomUser.data().image;

                        noMessagesDiv.innerHTML = ``;

                        // Add chat room on messages tab modal
                        messageTabDiv.innerHTML += `
                            <div class="chat-history" onClick="gotoChatRoom('${ chatroomUsersID[0] }')">
                                <div class="chat-with">
                                    <img class="chat-profile" src="${ roomUserImage }">
                                    <div class="chat-wrap pl-3x">
                                        <a style="text-transform: capitalize" class="bold-txt">${ roomUserName }</a><br>
                                        <a>${ room.data().lastMessage }</a><br>
                                        <a class="chat-time">${ moment(room.data().lastMessageDate).format('hh:mm a')}</a>
                                    </div>
                                </div>
                            </div>
                        `;

                    });
                }  
            } 
        });
    });
}

// Update ActiveUsers List with true status
function activeUser()
{
    if(getCurrentUserIDFromLocalStorage() != null)
    {
        var currentUserID = getCurrentUserIDFromLocalStorage();

        db.collection('ActiveUsers').doc(currentUserID).set({
            active: true
        }).then(function() {
            console.log("Active list Update!");
        });
    }
}

// Update ActiveUsers List with false status
function UnActiveUser()
{
    if(getCurrentUserIDFromLocalStorage() != null)
    {
        var currentUserID = getCurrentUserIDFromLocalStorage();

        db.collection('ActiveUsers').doc(currentUserID).set({
            active: false
        }).then(function() {
            console.log("User is UnActive Update!");
            removeCurrentUserIDFromLocalStorage();
        });
    }
}

// Store current user ID in local storage
function storeCurrentUserIDAtLocalStorage() 
{
    localStorage.setItem("currentUserID", auth.currentUser.uid);
}

// Remove current user ID from local storage
function removeCurrentUserIDFromLocalStorage() 
{
    localStorage.removeItem("currentUserID");
}

// Get current user ID from local storage
function getCurrentUserIDFromLocalStorage() 
{
    return localStorage.getItem("currentUserID");
}


// Go to Chat Room
function gotoChatRoom(UserID)
{
    window.location.href = "/chat.html?chat_id=" + UserID;
}

//Go to search 
const searchBTN = document.getElementById('searchAds');

searchBTN.addEventListener('click', () => {

    const searchlocation = document.getElementById('searchLocation');
    const searchCategory = document.getElementById('searchCategory');
    const searchText = document.getElementById('searchText');

    if(searchText.value != "")
        window.location.href = "/search.html?location=" + searchlocation.value + "?category=" + searchCategory.value + "?search=" + searchText.value;
});

// Go to selected categories 
function gotoCategory(category)
{
    window.location.href = "/category.html?category=" + category;
}

