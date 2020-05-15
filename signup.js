function signup(captcha_response) {
   e.preventDefault();
   var URL =  "https://l9fmumcc19.execute-api.eu-west-1.amazonaws.com/production/submit";

    var form = document.getElementById("contact-form");
    var status = document.getElementById("contact-form-status");

    var reeamil = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
    if (!reeamil.test($("#email").val())) {
        status.innerHTML = "<span style='color: red;'>Please enter a valid email address</span>";
        return;
    }

   var data = {
      name : "sign-up",
      email : $("#email").val(),
      captcha : captcha_response
    };

    loading_status()
    var status_interval = setInterval(loading_status, 300)
    form.style.visibility = "hidden";

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
     },
     complete: function(){
        clearInterval(status_interval)
     }});
}

 function captcha_callback(response) {
    return new Promise(function(resolve, reject) { 
      document.getElementById("captcha").style.display='none';
      signup_copy(response);
      resolve();
    })
  }

function captcha_signup(e) {
    e.preventDefault();
    grecaptcha.render('captcha', {
      'sitekey' : '6Lc_vPcUAAAAAPcfcndR_45KB7edSb426aUTNnTe',
      'theme' : 'dark',
      'callback' : captcha_callback
    });
};


function loading_status(){
    var status = document.getElementById("contact-form-status");

    base_str = "We are signing you up"
    if (status.innerHTML == null || status.innerHTML == '&nbsp;') {
      status.innerHTML = base_str + "   ";
    }

    dots = 1
    for (var i = 0; i < 3; i++) {
      if (status.innerHTML[i + base_str.length] != '.') {
        break
      }
      dots += 1
    }
    if (dots == 4){
      dots = 1
    }
    
    status.innerHTML = base_str;
    for (var i = 1; i < 4; i++) {
      if (i <= dots){
        status.innerHTML = status.innerHTML + '.'
      }
      else{
        status.innerHTML = status.innerHTML + '&nbsp;'
      }
    }
}


function stoppedTyping(text){
      if(text.value.length > 0) { 
          document.getElementById('contact-form-button').disabled = false; 
      } else { 
          document.getElementById('contact-form-button').disabled = true;
      }
  }
