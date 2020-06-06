const QA_URL = "https://r15dwaoi2m.execute-api.eu-west-1.amazonaws.com/production/qa";
const QA_INIT_SECONDS = 40;

var start_qa_interval, loading_interval, status_timestamp = -1, is_loading = false;

function do_nothing(){}

function check_qa_status(xhr, settings, timestamp, success_fn, error_fn, complete_fn){
    if (status_timestamp > timestamp){
        return
    }
    status_timestamp = timestamp

    if(xhr.status === 250){
        if(!is_loading){
            start_loading()
        }
    }
    else {
        if(is_loading){
            end_loading()
        }
    }

    if(xhr.status >= 200 && xhr.status < 300){
        success_fn(xhr.responseJSON)
    }
    else {
        error_fn()
    }
    complete_fn(xhr, settings)
}

function relogin(){
    Cookies.remove('username')
    Cookies.remove('password')
    window.location.reload(false);
}

function check_cookies_status(){
    username = Cookies.get('username')
    password = Cookies.get('password')
    if (username == null || password == null) {
        relogin()
    }
}

function qa(
    type='ping',
    success_fn=do_nothing, error_fn=do_nothing, complete_fn=do_nothing,
    question='', person='', session=''
){
    check_cookies_status()
    var data = {
      username : Cookies.get('username'),
      password : Cookies.get('password'),
      type: type,
      question : question,
      person : person,
      session : session,
    };
    var timestamp = new Date().getTime()

    $.ajax({
        type: "POST",
        url : QA_URL,
        dataType: "json",
        crossDomain: "true",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        complete: function(xhr, settings){
            check_qa_status(xhr, settings, timestamp, success_fn, error_fn, complete_fn);
        }
    });
}

function login_qa(e) {
    e.preventDefault();
    button = document.getElementById("login-button")
    button.disabled = true
    Cookies.set('username', $("#username").val(), { expires: 1 })
    Cookies.set('password', $("#password").val(), { expires: 1 })
    error_fn = function () {
        Cookies.remove('username')
        Cookies.remove('password')
        alert('username or password invalid')
    }
    success_fn = function () {
        start_loading()
    }
    complete_fn = function () {
        button.disabled = false;
    }
    qa(type="login", success_fn=success_fn, error_fn=error_fn, complete_fn=complete_fn)
}

function initial_login() {
    username = Cookies.get('username')
    password = Cookies.get('password')
    if (username != null && password != null) {
        start_loading()
    }
}

function ask_qa(button) {
    ask_button = document.getElementById('ask-button')
    random_button = document.getElementById('random-button')

    $("#ai-answer").val("");
    $("#kw-answer").val("");

    if (button == ask_button){
        question = $('#ask-text').val()
        if (question == '') {
            return
        }
    } else {
        question = '*'
    }

    ask_button.disabled = true
    random_button.disabled = true

    success_fn = function (data) {
        if (data["body"] != null){
            $("#ai-answer").val(data["body"]["qa_result"]);
            $("#kw-answer").val(data["body"]["kw_result"]);
            $("#ask-text").val(data["body"]["question"]);
        }
    }
    error_fn = function () {
        $("#ai-answer").val("There was some problem with the server...");
    }
    complete_fn = function () {
        ask_button.disabled = false
        random_button.disabled = false
    }

    qa(type='question',
       success_fn=success_fn, error_fn=error_fn, complete_fn=complete_fn,
       question=question, person=$("#person-select").val(), session=$("#session-select").val())
    return false
}

function start_loading(){
    limit_demo()
    is_loading = true
    display_container("loading-container")
    NProgress.configure({ parent: '#loading-bar', minimum: 0.00001 });
    NProgress.set(0.0);
    reload_speed = QA_INIT_SECONDS * 10
    start_qa_interval = setInterval(qa, 2000);
    loading_interval = setInterval(function(){NProgress.inc(0.01)}, reload_speed);
    qa(type='ping')
}

function end_loading(){
    is_loading = false
    NProgress.done();
    $("#ai-answer").val("");
    $("#kw-answer").val("");
    display_container("qa-container")
    clearInterval(start_qa_interval);
    clearInterval(loading_interval);
}

function display_container(container){
    containers = ["login-container", "loading-container", "qa-container"];
    for (var i = 0; i < containers.length; i++) {
        element = document.getElementById(containers[i])
        if (containers[i] == container){
            element.style.display = ''
        } else {
            element.style.display = 'none'
        }
    }
}

function limit_demo(){
    if (Cookies.get('username') != 'tim'){
        person_select = document.getElementById('person-select')
        for (var i=person_select.length-1; i>0; i--) {
            person_select.remove(i);
        }
        $('select').selectpicker('refresh');
    }
}

$(document).ready(function () {
    initial_login();
})
