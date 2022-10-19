let registerBtn = document.querySelector('#register');



registerBtn.addEventListener('click', () => {
    let username = document.querySelector('#Username').value;
    let password = document.querySelector('#password').value;


    if (!username || !password) {
        alertDanger("Kindly fill in username and password to register ")
    } else {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("username", username);
        urlencoded.append("password", password);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("https://anonymous-message.adaptable.app/user/register", requestOptions)
            .then(response => response.json())
            .then(result => {

                if(result.error){
                    alertDanger(result.message);
                    return ;
                }

                alertSuccess("registeration successful , redirecting to login page");
                setTimeout(() => {
                    window.location = 'login.html';
                }, 2000);

            })
            .catch(error => console.log('error', error));
    }
})



// alerts 

function alertSuccess(message) {
    let template = `<div class="success-alert">
    ${message}
  </div>`;

    document.querySelector('#alert').innerHTML = template;

    setTimeout(() => {
        document.querySelector('.success-alert').remove();
    }, 2000);
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