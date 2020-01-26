const loginModal = document.querySelector('#modalForm');

// Default authentication UI if user is not login
function defaultAuthenticationUI() {

    // Rename to Login
    $("#loginAccountBtn").text('Login');
    document.getElementById('loginAccountBtn').style.display = "";

    // Setup Default UI
    loginModal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header modal-header-bg text-center">
                <ul class="nav pills nav-justified">
                    <li class="pills-adjust">
                    <a class="nav-link lightBtn" data-toggle="tab" href="#loginForm">Login Here</a>
                    </li>
                    <li class="pills-adjust">
                    <a class="nav-link lightBtn" data-toggle="tab" href="#registerForm">Create New</a>
                    </li>
                </ul>
            </div>
            <div class="modal-body">

                <div class="tab-content container">
                    <!--tab-0 Login Form-->  
                    <div id="loginForm" class="tab-pane fade in active show">

                        <div class="text-center" style="color: #444">
                            <h5>Connect With</h5>
                        </div>
                        <div class="connect-with">
                            <ul class="nav pills nav-justified">
                                <li class="pills-adjust">
                                    <button class="nav-link fb-icon btn-block btn-fb btn-no-border" type="button" onClick="signInWithFB()">Facebook</button>
                                </li>
                                <li class="pills-adjust">
                                    <button class="nav-link gPlus-icon btn-block btn-google btn-no-border" type="button" onClick="signInWithGoogle()">Google +</button>
                                </li>
                                </ul>
                            </div>
                            <div class="divider">
                            <span>or</span>
                            </div>

                        <form id="login-form" action="index.html">
                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <img class="input-group-text" src="images/emailAdd.png">
                            </div>
                            <input type="email" class="form-control" name="loginEmail" id="loginEmail" placeholder="Enter your email"  required>
                            </div>

                            <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <img class="input-group-text" src="images/password.png">
                            </div>
                            <input type="password" class="form-control" name="loginPassword" id="loginPassword" placeholder="Enter your password"  required>
                            </div>
                            <div class="input-group mb-3">
                            <button class="lightBtn btn-block btn-no-border" onClick="login()">Login</button>
                            </div>
                            <div class="text-center mb-3">
                            <a data-toggle="tab" href="#resetForm">Reset Account?</a>
                            </div>

                            <div class="input-group mb-3" id="loginMessage" style="display: none">
                            </div>

                        </form>
                    </div>
                    <!--tab-1 Register Form-->  
                    <div id="registerForm" class="tab-pane fade">

                        <div class="text-center" style="color: #444">
                            <h5>Create an Account</h5>
                        </div>

                        <div class="divider">
                        </div>

                        <form id="register-form" action="index.html">

                            <div class="text-center mb-3">
                                <div id="profile" class="ProfilePreview"></div>
                                <input id="upload" type="file" name="registerImageUpload" class="profileUpload" onchange="ImagePreview('profile','upload')" accept="image/*">
                                </div>

                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <img class="input-group-text" src="images/user.png">
                                </div>
                                <input type="text" class="form-control" name="registerUsername" id="registerUsername" placeholder="Enter your username"  required>
                                </div>

                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                <img class="input-group-text" src="images/emailAdd.png">
                                </div>
                                <input type="email" class="form-control" name="registerEmail" id="registerEmail" placeholder="Enter your email"  required>
                            </div>

                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                <img class="input-group-text" src="images/password.png">
                                </div>
                                <input type="password" class="form-control" name="registerPassword" id="registerPassword" placeholder="Create a password"  required>
                            </div>

                            <div class="input-group mb-3">
                                <button id="registerAccountBTN" class="lightBtn btn-block btn-no-border" onClick="register()">Register</button>
                            </div>

                            <div class="input-group mb-3" id="registerMessage" style="display: none">
                            </div>
                        </form>
                    </div>
                    <!--tab-2 Reset Form-->  
                    <div id="resetForm" class="tab-pane fade">
                        <form id="reset-form" action="index.html">

                            <div class="text-center" style="color: #444">
                                <h5>Reset an Account</h5>
                            </div>

                            <div class="divider">
                            </div>

                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                <img class="input-group-text" src="images/emailAdd.png">
                                </div>
                                <input type="email" class="form-control" name="resetEmail" id="resetEmail" placeholder="Enter your email"  required>
                            </div>

                            <div class="input-group mb-3">
                                <button class="lightBtn btn-block btn-no-border" onClick="resetAccount()">Reset</button>
                            </div>

                            <div class="input-group mb-3" id="resetMessage" style="display: none">
                            </div>

                        </form>
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
}

// Goto Post Ads button
const goPostAds = document.querySelector('#gotoPostAds');

goPostAds.addEventListener('click', () => {
    window.location.href = "/post_ads.html";
});

// Setup post ad form UI
function setPostAdUI() {

    // Get post ad form element
    const postAdForm = document.querySelector('#setAdForm');

    if(postAdForm)
    {
        // Set post ad UI
        postAdForm.innerHTML = `
        <div class="post-ad-heading">
            <a>POST YOUR AD</a>
        </div>
        <div class="post-ad-bx wm-60a">
            <h5>SELECT CATEGORY</h5>
            <form id="postAd-form" action="index.html">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <img class="input-group-text" src="images/ad_category.png">
                    </div>
                    ​<select class="form-control" id="postAdCategory" name="postAdCategory">
                        <option value="TVsElectronics">TVs & Electronics</option>
                        <option value="RealEstate">Real Estate</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Mobiles">Mobiles</option>
                        <option value="Laptops">Laptops</option>
                        <option value="Bikes">Bikes</option>
                        <option value="Cars">Cars</option>
                    </select>
                </div>
                    
                <h5>SELECT CONDITION</h5>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <img class="input-group-text" src="images/ad_condition.png">
                    </div>
                    ​<select class="form-control" id="postAdCondition" name="postAdCondition">
                        <option value="New">New</option>
                        <option value="Used">Used</option>
                    </select>
                </div>

                <h5>AD TITLE</h5>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <img class="input-group-text" src="images/ad_title.png">
                    </div>
                    <input type="text" class="form-control" id="postAdTitle" name="postAdTitle" placeholder="Enter Ad Title" required>
                </div>

                <h5>DESCRIPTION</h5>
                <div class="input-group mb-3">
                    <textarea style="height: 150px" class="form-control" id="postAdDescription" name="postAdDescription" placeholder="Enter Description" required></textarea>
                </div>

                <h5>SET PRICE</h5>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <label class="input-group-text rs">Rs</label>
                    </div>
                    <input type="number" class="form-control" id="postAdPrice" name="postAdPrice" placeholder="Enter your Price" required>
                </div>

                <h5>UPLOAD PHOTOS</h5>
                <div class="row">
                    <div class="col-md-3 mb-3">
                        <div id="p1" class="PreviewPicture"></div>
                        <input id="postAdImage1" type="file" accept="image/*" name="postAdImage1" class="FileUpload" onchange="ImagePreview('p1','postAdImage1')">
                    </div>
            
                    <div class="col-md-3 mb-3">
                        <div id="p2" class="PreviewPicture"></div>
                        <input id="postAdImage2" type="file" accept="image/*" name="postAdImage2" class="FileUpload" onchange="ImagePreview('p2','postAdImage2')">
                    </div>
            
                    <div class="col-md-3 mb-3">
                        <div id="p3" class="PreviewPicture"></div>
                        <input id="postAdImage3" type="file" accept="image/*" name="postAdImage3" class="FileUpload" onchange="ImagePreview('p3','postAdImage3')">
                    </div>  
            
                    <div class="col-md-3 mb-3">
                        <div id="p4" class="PreviewPicture"></div>
                        <input id="postAdImage4" type="file" accept="image/*" name="postAdImage4" class="FileUpload" onchange="ImagePreview('p4','postAdImage4')">
                    </div>
                </div>

                <h5>YOUR LOCATION</h5>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <img class="input-group-text" src="images/ad_location.png">
                    </div>
                    <select class="form-control" id="postAdCity" name="postAdProvince">
                        <option value="Select province">Select province</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="KPK">KPK</option>
                    </select>
                    <input type="text" class="form-control" id="postAdLocation" name="postAdLocation" placeholder="Enter your Location" required>
                </div>

                <h5>YOUR PHONE NUMBER</h5>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <img class="input-group-text" src="images/ad_phone.png">
                    </div>
                    <input type="number" class="form-control" id="postAdPhone" name="postAdPhone" placeholder="Enter your Phone Number" required>
                </div>

                <div class="input-group mb-3">
                    <button id="postNowAdBTN" type="button" class="lightBtn btn-block btn-no-border" onClick="postAd()">POST NOW</button>
                </div>

                <div class="input-group d-flex justify-content-center" id="postAdMessage" style="display: none">
                </div>
            </form>
        </div>
        `;
    }
}

// Login Required error message UI
function loginRequired(divId) {

    // Get element from ID
    const loginRequiredDiv = document.getElementById(divId);

    if(loginRequiredDiv)
    {
        // set UI
        loginRequiredDiv.innerHTML = `
        <div class="post-ad-bx wm-60a" style="margin-top: 5%; color: #dc3545">
            <div class="text-center">
            <img src="images/loginReq.png">
            <h2><b>Login Required</b></h2>
            <p style="font-size: 16px"><b>Attention! </b>You must login with your account using your email and password. If you don't have an account register your account first.</p>
            <button type="button" class="wm-60a lightBtn btn-no-border"  data-toggle="modal" data-target="#modalForm">Login</button>
            </div>
        </div> 
    `;
    }
}

// Message display function
function MessageDisplay(divID, alertClass, message) {

    const display_Div = document.querySelector(divID);

    $(divID).show(0, () => {
        display_Div.innerHTML = `
        <div class="alert ${ alertClass } alert-dismissible" style="width: 100%">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <span> ${ message } </span>
        </div>
    `;
    });
    //setTimeout(function() { $(divID).hide(); }, 10000);
}

//Unique Identifier for image
function image_uID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}