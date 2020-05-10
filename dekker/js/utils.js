function populate_sessions(sessions){
    var $personSelect = $("#person-select");
    $personSelect.empty();
    $.each(sessions, function(index, value) {
        $personSelect.append("<option>" + index + "</option>");
    });

    $("#person-select").change(function() {
        var $dropdown = $(this);
        var key = $dropdown.val();
        var vals = sessions[key].split(",");
        var $sessionSelect = $("#session-select");
        $sessionSelect.empty();
        $.each(vals, function(index, value) {
            $sessionSelect.append("<option>" + value + "</option>");
        });
    });
    $("#person-select").change()
    $('select').selectpicker();
}

function populate_placeholders(placeholders){
    ask_text = document.getElementById("ask-text")
    placeholder = placeholders["ask"]
    ask_text.placeholder = placeholder
    ask_text.onfocus=function(e){e.target.placeholder = ""}
    ask_text.onblur=function(e){e.target.placeholder = placeholder}
}

function populate_elements(){
    $.ajax({
      url: 'content/elements.json',
      dataType: 'json',
      success: function (data) {
        populate_placeholders(data["placeholders"])
        populate_sessions(data["selects"])
      }
    });
}

function connect_elements(){
    document.getElementById('ask-text').onkeypress=function(e){
        if (e.key === 'Enter'){
            e.preventDefault();
            document.getElementById('ask-button').click()
        }
    }
}

$(document).ready(function () {
    populate_elements();
    connect_elements();
})