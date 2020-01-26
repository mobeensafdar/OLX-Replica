function ImagePreview(preview, upload) { 
    var PreviewIMG = document.getElementById(preview); 
    var UploadFile    =  document.getElementById(upload).files[0]; 
    
    var ReaderObj  =  new FileReader();
    ReaderObj.onloadend = function () { 
       PreviewIMG.style.backgroundImage  = "url("+ ReaderObj.result+")";
     } 

    if (UploadFile) { 
       ReaderObj.readAsDataURL(UploadFile);
     } else { 
        PreviewIMG.style.backgroundImage  = "";
     } 
}