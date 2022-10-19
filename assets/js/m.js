let usernameEl = document.querySelector('#username');
let sendMessage = document.querySelector('.submit');
let message = document.querySelector('#message');
let username = '';

window.onload = verifyUrl();


function verifyUrl() {
    let url = new URLSearchParams(window.location.search);

    if (url.has('u')) {
        username = url.get('u');
        usernameEl.textContent = username;
    } else {
        window.location = 'index.html';
    }

}



function send() {

    if (!message.value) {
        alertDanger('Message cannot be empty ');
    } else {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("message", message.value);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("http://localhost:3000/message/create/"+username, requestOptions)
            .then(response => response.json())
            .then(result => {
                if(result.createdAt){
                    alertSuccess("Good job, Message sent successfully.")
                }

                if(result.statusCode == 400){
                    alertDanger('message send failed ,invalid user link')
                }
            })
            .catch(error => console.log('error', error));

        message.value = "";
    }
}


function alertDanger(message) {
    let template = `<div class="danger-alert">
    ${message}
  </div>`

    document.querySelector('#alert').innerHTML = template;

    setTimeout(() => {
        document.querySelector('.danger-alert').remove();
    }, 2500);
}



function alertSuccess(message){
    let template = `<div class="success-alert">
    ${message}
  </div>`;

  document.querySelector('#alert').innerHTML = template;

  setTimeout(() => {
    document.querySelector('.success-alert').remove();
  }, 3000);
}