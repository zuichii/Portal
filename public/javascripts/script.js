function postEvent(){

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year= date.getFullYear();

    let currentDate =`${day}-${month}-${year}`;

    var p1 = document.createElement("p");
    p1.innerHTML = currentDate;
    p1.className = "post-time";

    var p2 = document.createElement("p");
    p2.innerHTML = document.getElementById("content").value;
    p2.className = "post-content";

}

// show filters for home.html
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

const rsvpButton = document.getElementById('rsvp-button');
const rsvpOptions = document.getElementsById('rsvp-options');

rsvpButton.addEventListener('click', () => {
    rsvpOptions.classList.toggle('hidden');
});

// cooked code, finish pls
// const optionButtons = document.querySelectorAll('.option');

// optionButtons.forEach(button => {
//     button.addEventListener('click', () => {
//         alert('You clicked ${button.textContent}!');
//     });
// });


// const { createConnection } = require("net");

// const vueinst = new Vue({
//     el: '#app',
//     data: {
//       email: '',
//       username: '',
//       password: '',
//       passwordConfirm: ''
//     },
//     methods: {
//       signup() {
//         const email = this.email;
//         const username = this.username;
//         const password = this.password;
//         const passwordConfirm = this.passwordConfirm;

//         // Check if any field is empty
//         if (!email || !username || !password || !passwordConfirm) {
//           alert('Please fill in all fields');
//           return;
//         }

//         // Check if the email is valid
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//           alert('Please enter a valid email address');
//           return;
//         }

//         if (password !== passwordConfirm) {
//           alert("Passwords don't match");
//           return;
//         }

//         const logindata = {
//           email,
//           username,
//           password
//         };

//         const req = new XMLHttpRequest();
//         req.onreadystatechange = function () {
//           if (req.readyState === 4) {
//             if (req.status === 200) {
//               alert('Signed up successfully');
//             } else if (req.status === 401) {
//               alert('Signed up failed');
//             }
//           }
//         };

//         req.open('POST', '/createacc');
//         req.setRequestHeader('Content-Type', 'application/json');
//         req.send(JSON.stringify(logindata));
//       }
//     }
//   });




function signup() {
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('passwordConfirm');

    const email = emailInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

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
      if (req.readyState === 4) {
        if (req.status === 200) {
          alert('Signed up successfully');
        } else if (req.status === 401) {
          alert('Signed up failed');
        }
      }
    };

    req.open('POST', '/createacc');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(logindata));
  }


function login() {
    let logindata = {
        username: document.getElementById('login-user').value,
        password: document.getElementById('login-pass').value
    };

    let req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                alert('Logged In successfully');
            } else if (req.status == 401) {
                alert('Login FAILED');
            }
        }
    };

    req.open('POST', '/login');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(logindata));
}