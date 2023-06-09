// ajax request to dynamically load the content of club_profile page
function getClubProfile() {
  var urlParams = new URLSearchParams(window.location.search);
  var clubId = urlParams.get('id');
  console.log('getClubProfile function called with clubId:', clubId);
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      var clubData = JSON.parse(this.responseText);

      document.getElementById('clubName').innerText = clubData.club_name;
      document.getElementById('clubStats').innerText = '@' + clubData.club_name + ' ' + clubData.num_members + ' MEMBERS ' + clubData.num_posts + ' POSTS';
      document.getElementById('clubLogo').src = "/images/club" + clubId + ".jpg";

      var hero = document.querySelector('.clubHero');
      hero.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/images/club' + clubId + '.jpg")';
    }
  };

  xhttp.open('GET', '/club_profile?id=' + clubId, true);
  xhttp.send();
}
// call the function after page loads
window.addEventListener('DOMContentLoaded', getClubProfile);



function loadClubPosts() {
  var urlParams = new URLSearchParams(window.location.search);
  var clubId = urlParams.get('id');
  console.log('loadPosts function called with clubId:', clubId);
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      var postsData = JSON.parse(this.responseText);
      var postContainer = document.getElementById('clubContent');

      // Clear the existing content
      postContainer.innerHTML = '';

      // Create and append the posts
      for (var i = 0; i < postsData.length; i++) {
        var post = postsData[i];
        var postElement = document.createElement('div');
        postElement.classList.add('post');

        var title = document.createElement('h4');
        title.innerText = post.post_title;

        var content = document.createElement('p');
        content.innerText = post.post_content;

        postElement.appendChild(title);
        postElement.appendChild(content);

        postContainer.appendChild(postElement);
      }
    }
  };

  xhttp.open('GET', '/get_posts?id=' + clubId, true);
  xhttp.send();
}

window.addEventListener('DOMContentLoaded', loadClubPosts);




function loadClubEvents() {
  var urlParams = new URLSearchParams(window.location.search);
  var clubId = urlParams.get('id');
  console.log('loadClubEvents function called with clubId:', clubId);
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      var eventsData = JSON.parse(this.responseText);
      var eventContainer = document.getElementById('clubContent');

      // Clear the existing content
      eventContainer.innerHTML = '';

      // Create and append the events
      for (var i = 0; i < eventsData.length; i++) {
        var event = eventsData[i];
        var eventElement = document.createElement('div');
        eventElement.classList.add('event');

        var title = document.createElement('h4');
        title.innerText = event.event_name;

        var date = document.createElement('p');
        date.innerText = event.event_datetime;

        var location = document.createElement('p');
        location.innerText = event.event_location;

        eventElement.appendChild(title);
        eventElement.appendChild(date);
        eventElement.appendChild(location);

        eventContainer.appendChild(eventElement);
      }
    }
  };

  xhttp.open('GET', '/get_events?id=' + clubId, true);
  xhttp.send();
}



function loadClubDescription() {
  var urlParams = new URLSearchParams(window.location.search);
  var clubId = urlParams.get('id');
  console.log('loadClubDescription function called with clubId:', clubId);
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      var clubData = JSON.parse(this.responseText);
      var descriptionContainer = document.getElementById('clubContent');

      // Clear the existing content
      descriptionContainer.innerHTML = '';

      // Create and append the description
      var description = document.createElement('p');
      description.innerText = clubData.club_description;

      descriptionContainer.appendChild(description);
    }
  };

  xhttp.open('GET', '/get_club_description?id=' + clubId, true);
  xhttp.send();
}



function signup() {
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;

  // Check if any field is empty
  if (!email || !username || !password || !passwordConfirm) {
    alert('Please fill in all fields');
    return;
  }

  // Check if the email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return;
  }

  if (password !== passwordConfirm) {
    alert("Passwords don't match");
    return;
  }

  const logindata = {
    email,
    username,
    password
  };

  const req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      window.location.href = 'login.html';
      alert('Signed up successfully');
    } else if (this.status === 401) {
      alert('Signed up failed');
    }
  };

  req.open('POST', '/createacc');
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(logindata));
}


// Updated AJAX function
function login() {
  let logindata = {
    username: document.getElementById('username').value,
    password: document.getElementById('password').value
  };

  let req = new XMLHttpRequest();

  req.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        window.location.href = 'home.html';
        alert('Logged in successfully');
      } else if (this.status === 401) {
        alert('Login FAILED');
      }
    }
  };

  req.open('POST', '/login');
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(logindata));

}


function logout() {
  let req = new XMLHttpRequest();

  req.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
          alert('Logged Out');
          window.location.href = 'home.html';
      } else if(this.readyState == 4 && this.status == 403){
          alert('Not logged in');
      }
  };

  req.open('POST','/logout');
  req.send();

}



function do_google_login(response){

  // Sends the login token provided by google to the server for verification using an AJAX request

  console.log(response);

  // Setup AJAX request
  let req = new XMLHttpRequest();

  req.onreadystatechange = function(){
      // Handle response from our server
      if(req.readyState == 4 && req.status == 200){
          alert('Logged In with Google successfully');
      } else if(req.readyState == 4 && req.status == 401){
          alert('Login FAILED');
      }
  };

  // Open requst
  req.open('POST','/google_login');
  req.setRequestHeader('Content-Type','application/json');
  // Send the login token
  req.send(JSON.stringify(response));

}



function retrieveClubId(){

  const params = new URLSearchParams(window.location.search);
  return params.get('id');

}










function subscriptionToggler() {
  const button = document.getElementById('subscribe');
  const ifSubbed = button.textContent === 'Subscribe';

  // const userId = retrieveUserId().userDetails.user_id;
  const clubId = retrieveClubId();

  const toggle = new XMLHttpRequest();

  toggle.open('POST', ifSubbed ? '/subscribe' : '/unsubscribe');
  toggle.setRequestHeader('Content-Type', 'application/json');

  toggle.onload = function() {
    if (toggle.status === 200) {
      if (ifSubbed) {
        alert('Subscribed to ' + clubId);
      } else {
        alert('Unsubscribed from ' + clubId);
      }
    } else {
      alert(ifSubbed ? 'Error subscribing.' : 'Error unsubscribing.');
    }
  };

  toggle.send(JSON.stringify({ clubId }));

  button.textContent = ifSubbed ? 'Unsubscribe' : 'Subscribe';
}







function getUserInfo() {
  const req = new XMLHttpRequest();

  req.onreadystatechange = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        const userInfo = JSON.parse(req.responseText);
        console.log(userInfo);
        const name = userInfo.user_name;
        const email = userInfo.email;
        const nameElement = document.getElementById("name");
        const emailElement = document.getElementById("email");
        nameElement.innerHTML = name;
        emailElement.innerHTML = email;
      }
    }
  };

  req.open('GET', '/get_current_user_info');
  req.send();
}


function updateUser(event) {
  event.preventDefault(); // Prevent the form from submitting normally

  // Retrieve the updated values from the input fields
  const name = document.getElementById('name-input').value;
  const email = document.getElementById('email-input').value;

  // Prepare the data to be sent in the request
  const data = {
    name: name,
    email: email
  };

  // Make an AJAX request to update the user information
  const req = new XMLHttpRequest();
  req.open('POST', '/update_user', true);
  req.setRequestHeader('Content-Type', 'application/json');

  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status === 200) {
        // Request successful, handle the response
        const response = JSON.parse(req.responseText);
        console.log(response.message);

        // Update the display fields with the new values
        document.getElementById('name').textContent = name;
        document.getElementById('email').textContent = email;

        // Toggle back to display mode
        toggleEditField('name');
        toggleEditField('email');
      } else {
        // Request failed, handle the error
        console.error('Error:', req.status);
      }
    }
  };

  // Send the request with the data
  req.send(JSON.stringify(data));
}

