$("input[type=file]").change(function(){
    const preview = document.querySelector("#imgPreview");
    const file = document.querySelector("input[type=file]").files[0];
    const reader = new FileReader();
    const inputBase64 = document.querySelector("#imgBase64");
  
    reader.addEventListener(
      "load",
      () => {
        // convert image file to base64 string
        let base64 = reader.result;
        
        preview.src = base64;
        inputBase64.value = base64;
      },
      false,
    );
  
    if (file) {
      console.log(reader.readAsDataURL(file));
    }
    
});