let username = document.querySelector("#username");
let joinedDate = document.querySelector("#joinedDate");
let messageCount = document.querySelector("#messageCount");
let messagesContainer = document.querySelector("#messages-inner");
let copyLinkBtn = document.querySelector('#copy-link');
let userLink = '';

let frontendUrl = 'https://anonymousme.netlify.app'

window.onload = validateToken()


let currentUserUsername = '';
// validate and get user profile
async function validateToken() {
    let token = localStorage.getItem('access_token');

    if (token) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + JSON.parse(token));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        await fetch("http://localhost:3000/user/profile", requestOptions)
            .then(response => response.json())
            .then(result => {

                if (result.username) {
                    currentUserUsername = result.username;
                    updatePage(result);

                    // set userLink
                    userLink = `${frontendUrl}/m.html?u=${result.username}`;
                    document.querySelector('#unique-link').value = userLink;
                }
            })
            .catch(error => console.log('error', error));
    } else {
        window.location = 'login.html';
    }
}

function updatePage(result) {
    username.textContent = "@" + result.username;
    joinedDate.textContent = "Joined " + result.joinedAt;

    let token = localStorage.getItem('access_token');

    getMessages(token, result.username);
}


// get user messages 
function getMessages(token, username) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + JSON.parse(token));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/message/all/" + username, requestOptions)
        .then(response => response.json())
        .then(result => {
            updateMessageCount(result);
            updateMessages(result[0].messages)
        })
        .catch(error => console.log('error', error));
}


// update message count 
function updateMessageCount(payload) {
    messageCount.innerHTML = (payload[0].totalMessages != null || payload[0].totalMessages != '') ? `${payload[0].totalMessages} <span
    class="follow">Messages</span>` : `0 <span
    class="follow">Messages</span>`;
}


// update messages 
function updateMessages(items) {
    let html = '';

    if(items.length == 0){
        html += ` <div class="col-lg-4">
        <div class="card card-margin">
            <div class="card-header no-border">
                <h5 class="card-title fw-bold">Annonymous</h5>
            </div>
            <div class="card-body pt-0">
                <div class="widget-49">
                    <p class="widget-49-meeting-points">
                       You don't have any message
                    </p>
                  
                </div>
            </div>
        </div>
    </div> `
    }else {

    items.forEach(item => {
        html += ` <div class="col-lg-4">
    <div class="card card-margin">
        <div class="card-header no-border">
            <h5 class="card-title fw-bold">Annonymous</h5>
        </div>
        <div class="card-body pt-0">
            <div class="widget-49">
                <p class="widget-49-meeting-points">
                   ${item.message}
                </p>
              
            </div>
            <button class="delete-item" id="${item.id}" onclick="deleteMessage(this.id)">Delete</button>
        </div>
    </div>
</div> `
    });

}

    messagesContainer.innerHTML = html;
}


// copy to clipboard 
copyLinkBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(userLink);
    alertSuccess("copied successfully")
})


// delete message 

function deleteMessage(id) {
    var myHeaders = new Headers();
    let token = localStorage.getItem('access_token')
    myHeaders.append("Authorization", "Bearer " + JSON.parse(token));

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/message/" +id, requestOptions)
        .then(response => response.text())
        .then(result => {
            getMessages(token, currentUserUsername);
        })
        .catch(error => console.log('error', error));


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