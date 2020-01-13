const INFO_BOX_ID = "#body-page-infobox";

var utilityLib = new UtilitiesLibrary(INFO_BOX_ID);
var backendApi = new BackendApi(BACKEND_URL);

function validateInputAndRegisterUser(e) {
    e.preventDefault();

    var usernameInputField = $('#register-username');
    var passwordInputField = $('#register-password');

    const inputMail = usernameInputField.val();
    const inputPassword = passwordInputField.val();
    if(inputMail.length > 0 && inputPassword.length > 0) {
        usernameInputField.removeClass("is-invalid");
        passwordInputField.removeClass("is-invalid");

        backendApi.registerUser(inputMail, inputPassword, function(err, res){
            if(!err) {
                if(res.data && res.data.isSucceded) {
                    utilityLib.informUser("alert-success", "You succesfully signed up! Now, go to login page to start using RecViz!")
                } else {
                    if(res.msg) {
                        utilityLib.informUser("alert-danger", "Unable to register: "+res.msg)
                    } else {
                        utilityLib.informUser("alert-danger", "Unable to register.")
                    }
                }
            } else {
                utilityLib.informUser("alert-danger", "Error occoured, unable to create the account.")
            }
        })
    } else {
        if(inputMail.length == 0) {
            usernameInputField.addClass("is-invalid");
        } else {
            usernameInputField.removeClass("is-invalid");
        }

        if(inputPassword.length == 0) {
            passwordInputField.addClass("is-invalid");
        } else {
            passwordInputField.removeClass("is-invalid");
        }
    }
}

const projectTitle = GLOBAL_FRONT_END_CONFIG.PROJECT_TITLE;
const projectBrand = GLOBAL_FRONT_END_CONFIG.PROJECT_BRAND;

window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("project-title").innerHTML = projectTitle;
    document.getElementById("project-brand").innerHTML = projectBrand;

    $("#register-button").click(validateInputAndRegisterUser);
    $('#register-form').on("keypress", function (e) {
        if (e.which == 13) {
            validateInputAndRegisterUser(e);
        }
    });
});