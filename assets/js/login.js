let username = document.querySelector("#Username");
let password = document.querySelector("#password")
let submit = document.querySelector("#login")


window.onload = validateToken();

submit.addEventListener("click", login);

 function login() {

    if(!username.value || !password.value){
        alertDanger('kindly fill in your username and password');
    } else {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("username", username.value.trim());
    urlencoded.append("password", password.value.trim());

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

     fetch("https://anonymous-message.adaptable.app/user/login", requestOptions)
        .then(response => response.json())
        .then(result => {

            if(result.error){
                alertDanger(result.message)
            }

            let token = result.accessToken

            if (token) {
                localStorage.setItem('access_token', JSON.stringify(token));
                alertSuccess('Login Successful')
                validateToken();
            };
        })
        .catch(error => console.log('error', error));

    }

};



 function validateToken() {
    let token = localStorage.getItem('access_token');

    if (token) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+JSON.parse(token));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

         fetch("https://anonymous-message.adaptable.app/user/profile", requestOptions)
            .then(response => response.json())
            .then(result => {

                if(result.username) {
                    window.location = 'profile.html';
                }
            })
            .catch(error => console.log('error', error));
    } else {
        //
    }
}




// alerts 

function alertSuccess(message){
    let template = `<div class="success-alert">
    ${message}
  </div>`;

  document.querySelector('#alert').innerHTML = template;

  setTimeout(() => {
    document.querySelector('.success-alert').remove();
  }, 1500);
}


function alertDanger(message){
    let template = `<div class="danger-alert">
    ${message}
  </div>`

  document.querySelector('#alert').innerHTML = template;

  setTimeout(() => {
    document.querySelector('.danger-alert').remove();
  }, 1500);
}