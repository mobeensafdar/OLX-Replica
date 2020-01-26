// Get seller ID from URL function
function getSellerIdFromURL()
{
    // get URL after '?'
    var getURL = window.location.search.substring(1);

    // split after '='
    var id = getURL.split('=');

    // id[0] = chat_id and id[1] = required seller ID result or Data
    return id[1];   
}

auth.onAuthStateChanged( user => {

    // if user is login 
    if(user)
    {
        showChat();
    }
    else
    {
        loginRequired('chatContainer');
    }

});

// Get Current user and Seller Info form DB
function getUserAndSellerInfo() 
{
    return new Promise((resolve, reject) => {
        // current user and seller Id
        var currentUserID = auth.currentUser.uid;
        var sellerID = getSellerIdFromURL();

        // variable for store info
        var currentUserName, currentUserImage;
        var sellerName, sellerImage;

        var info;

        if(sellerID && sellerID != currentUserID)
        {
            // get current user info from DB
            db.collection("users").doc(sellerID).get().then(sellerDoc => {

                if(sellerDoc.exists)
                {  
                    sellerName = sellerDoc.data().username;
                    sellerImage = sellerDoc.data().image;

                    // get current user info from DB
                    db.collection("users").doc(currentUserID).get().then( currentUserDoc => {

                        currentUserName = currentUserDoc.data().username;
                            currentUserImage = currentUserDoc.data().image;

                            info = 
                            {
                                currentUserID: currentUserID,
                                currentUserName: currentUserName,
                                currentUserImage: currentUserImage,
                                sellerID: sellerID,
                                sellerName: sellerName,
                                sellerImage: sellerImage
                            }
                            resolve(info);
                            return info;
                    });

                }
                else
                    window.location.href = "/404.html";
            });
        }
        else
            window.location.href = "/404.html";
    });
}

// Get user Active Status
function getUserActiveStatus()
{
    // current user and seller Id
    var currentUserID = auth.currentUser.uid;
    var sellerID = getSellerIdFromURL();

    // get activeStatus div element by id
    const activeStatusDiv = document.getElementById("activeStatus");

    if(sellerID && sellerID != currentUserID)
    {
        db.collection('ActiveUsers').doc(sellerID).onSnapshot({
            // Listen for document metadata changes
            includeMetadataChanges: true
        }, function(ActiveUsersDoc) {
        
           var userActiveStatus = ActiveUsersDoc.data().active;

           if(userActiveStatus == true)
                activeStatusDiv.innerHTML = `
                    <div class="status-dot btn-success"></div>
                    <a class="active-user text-primary">Active Now</a>
                `;
            
            else
                activeStatusDiv.innerHTML = `
                    <div class="status-dot btn-danger"></div>
                    <a class="active-user text-muted">Offline</a>
                `;

        });
    }
}

// show Chat function
function showChat() 
{ 
    getUserAndSellerInfo().then(info => {

        //get element by ID
        var chatContainerDIV = document.getElementById('chatContainer');

        chatContainerDIV.innerHTML = `
            <div class="row chat-bx">
                <div class="col-md-4 bg-chat-left pb-01s">
                    <div id="currentUser" class="chat-user">
                        <img class="chat-profile" src="${ info.currentUserImage }">
                        <a style="text-transform: capitalize" class="pl-3x">${ info.currentUserName }</a>
                    </div>

                    <div class="chat-messages">
                        <img src="images/chatMsg.png">
                        <a>Chat Messages</a>
                    </div>
                    
                    <div id="chatWithUsers" class="chat-messages-area bx-height">

                    </div>
                    
                </div>  
                <div class="col-md-8 bg-chat-right pb-01s">
                
                <div class="chat-top-area">

                    <div id="sellerUser" class="chat-with-user">
                        <img class="chat-profile" src="${ info.sellerImage }">
                        <div class="pl-3x">
                            <div id="activeStatus"></div>
                            <a style="text-transform: capitalize">${ info.sellerName }</a>
                        </div>
                    </div>

                    <div class="chat-options">
                        <div class="dropdown dropleft float-right">
                            <a class="more-icon" title="More" data-toggle="dropdown"></a>
                            <div class="dropdown-menu">
                            <a class="dropdown-item" href="#">Clear Chat</a>
                            <a class="dropdown-item" href="#">Block</a>
                        </div>
                    </div>
                    </div>


                </div>

                <div id="chatMain" class="chat-main-area bx-height">
                    <ul id="chat">
                        
                    </ul>

                </div>

                <div id="sentMsg" class="sent-area">

                    <div class="input-group mb-3">
                        <textarea id="msgText" type="text" class="form-control message-write" placeholder="Write your message"></textarea>
                        <div class="input-group-append">
                            <form>
                            <button class="lightBtn sent-icon btn-no-border" onClick="sentMessages()">Sent</button> 
                            </form>
                        </div>
                    </div>

                </div>

                </div>
            </div>
        `;

        getUserActiveStatus();
        showChatMessages();
        showChatRoom();
    });
}

// show messages
function showChatMessages()
{
    var currentUserID = auth.currentUser.uid;
    var sellerID = getSellerIdFromURL();

    db.collection("chatRooms").where(`users.${currentUserID}`, "==", true).where(`users.${sellerID}`, "==", true)
    .get().then(function(Snapshot) {

        Snapshot.forEach(function(room) {

            if(room.exists)
            {
                // show message on UI
                db.collection("chatRooms").doc(room.id).collection("messages").orderBy('createdAt').onSnapshot(function(Snapshot) {

                    var chatUl = document.getElementById('chat');

                    Snapshot.docChanges().forEach(function(change) {

                        if(change.type == 'added')
                        {
                            var chatMessages = change.doc.data().message;
                            var chatUserID = change.doc.data().userID;
                            var messageTime = change.doc.data().createdAt;

                            getUserAndSellerInfo().then(info => {

                                var currentUserImg = info.currentUserImage;
                                var sellerImg = info.sellerImage;

                                function whichUser()
                                {
                                    var data;

                                    if(currentUserID == chatUserID)
                                        return data = {
                                            styleClass: "sent",
                                            image: currentUserImg
                                        };

                                    else
                                        return data = {
                                            styleClass: "reply",
                                            image: sellerImg
                                        };
                                }

                                chatUl.innerHTML += `
                                    <li class="${ whichUser().styleClass } mb-3">
                                        <img class="${ whichUser().styleClass } chat-user-profile" src="${ whichUser().image }">
                                        <div class="message-${ whichUser().styleClass }"> 
                                            <p>${ chatMessages }</p>
                                            <a class="chat-time">${ moment(messageTime).format('hh:mm a') }</a>
                                        </div>
                                    </li>
                                `;

                                // chat scroll at bottom when new message appear
                                var chatMainDiv = document.getElementById("chatMain");
                                chatMainDiv.scrollTop = chatMainDiv.scrollHeight;

                            });
                        }

                    });

                });
            }
            else
             console.log("Room not Exists");

        });

    });
}


// create chat room and sent message Event
function sentMessages() {
    event.preventDefault();

    const message = document.getElementById('msgText');

    var currentUserID = auth.currentUser.uid;
    var sellerID = getSellerIdFromURL();

    return new Promise((resolve, reject) => {

        db.collection("chatRooms").where(`users.${currentUserID}`, "==", true).where(`users.${sellerID}`, "==", true)
        .get().then(function(Snapshot) {
            let room = {};

            Snapshot.forEach(function(doc) {
                room = doc.data();
                room.id = doc.id;
            })

            // If no room create new and add message to it
            if(!room.id)
            {
                room = {
                    users: {
                        [currentUserID]: true,
                        [sellerID]: true
                    },
                    createdAt: Date.now(),
                    lastMessage: ''
                };

                if(message.value.trim() != "")
                {
                    db.collection("chatRooms").add(room).then(docRoom => {
                    
                        db.collection("chatRooms").doc(docRoom.id).collection("messages").add({
                            createdAt: Date.now(),
                            message: message.value.trim(),
                            userID: currentUserID
                        }).then(function() {
    
                            //Update Last Message
                            db.collection("chatRooms").doc(docRoom.id).update({
                                lastMessage: message.value.trim(),
                                lastMessageDate: Date.now()
                            });
                            
                            //sent push notification message request
                            pushMessages(message.value.trim(), sellerID);

                            message.value = "";
                            console.log("Message Added to DB.");
                            showChatMessages();
                            
                        });
    
                        resolve(room);
    
                    });
                }
            }
            // If room then only add message to existing room
            else
            {
                if(message.value.trim() != "")
                {
                    db.collection("chatRooms").doc(room.id).collection("messages").add({
                        createdAt: Date.now(),
                        message: message.value.trim(),
                        userID: currentUserID
                    }).then(function() {
    
                        //Update Last Message
                        db.collection("chatRooms").doc(room.id).update({
                            lastMessage: message.value.trim(),
                            lastMessageDate: Date.now()
                        })

                        //sent push notification message request
                        pushMessages(message.value.trim(), sellerID);

                        message.value = "";
                        console.log("Message Added to DB.");
                        
                    });
    
                    resolve(room);
                }
            }
                
        });

    });
}
 
// Show chat with Users or chat rooms
function showChatRoom()
{
    var currentUserID = auth.currentUser.uid;

    db.collection("chatRooms").where(`users.${currentUserID}`, "==", true)
    .onSnapshot(function(Snapshot) {

        var chatWithUsersDiv = document.getElementById("chatWithUsers");

        chatWithUsersDiv.innerHTML = ``;
        
        Snapshot.forEach(function(room) {

            if(room.exists)
            {  
                var chatroomUsersID = Object.keys(room.data().users);

                if(chatroomUsersID[0] == currentUserID)
                {
                    db.collection("users").doc(chatroomUsersID[1]).get().then(function(roomUser) {
                        var roomUserName = roomUser.data().username; 
                        var roomUserImage = roomUser.data().image;

                        // Add chat room on chat
                        chatWithUsersDiv.innerHTML += `
                            <div class="chat-history" onClick="gotoChatRoom('${ chatroomUsersID[1] }')">
                                <div class="chat-with">
                                    <img class="chat-profile" src="${ roomUserImage }">
                                    <div class="chat-wrap pl-3x">
                                        <a style="text-transform: capitalize" class="bold-txt">${ roomUserName }</a><br>
                                        <a>${ room.data().lastMessage }</a><br>
                                        <a class="chat-time">${ moment(room.data().lastMessageDate).format('hh:mm a') }</a>
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

                        // Add chat room on chat
                        chatWithUsersDiv.innerHTML += `
                            <div class="chat-history" onClick="gotoChatRoom('${ chatroomUsersID[0] }')">
                                <div class="chat-with">
                                    <img class="chat-profile" src="${ roomUserImage }">
                                    <div class="chat-wrap pl-3x">
                                        <a style="text-transform: capitalize" class="bold-txt">${ roomUserName }</a><br>
                                        <a>${ room.data().lastMessage }</a><br>
                                        <a class="chat-time">${ moment(room.data().lastMessageDate).format('hh:mm a') }</a>
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

// Go to Chat Room
function gotoChatRoom(UserID)
{
    window.location.href = "/chat.html?chat_id=" + UserID;
}