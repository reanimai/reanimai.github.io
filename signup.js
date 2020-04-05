function signup(e) {
   e.preventDefault();
   var URL =  "https://l9fmumcc19.execute-api.eu-west-1.amazonaws.com/production/submit";

    if ($("#email").val()=="") {
        alert ("Please enter your email id");
        return;
    }

    var reeamil = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
    if (!reeamil.test($("#email").val())) {
        alert ("Please enter valid email address");
        return;
    }

   var data = {
      message : $("#message").val(),
      email : $("#email").val()
    };

    var form = document.getElementById("contact-form");
    var status = document.getElementById("contact-form-status");
    form.style.display = "none";
    status.innerHTML = "We are signing you up...";

   $.ajax({
     type: "POST",
     url : URL,
     dataType: "json",
     crossDomain: "true",
     contentType: "application/json; charset=utf-8",
     data: JSON.stringify(data),

     success: function () {
        status.innerHTML = "Thank you, we will stay in touch!";
     },
     error: function () {
        status.innerHTML = "There was a problem submitting your email.";
     }});
}

function stoppedTyping(text){
      if(text.value.length > 0) { 
          document.getElementById('contact-form-button').disabled = false; 
      } else { 
          document.getElementById('contact-form-button').disabled = true;
      }
  }
