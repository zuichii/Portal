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



const vueinst = new Vue({
    el: '#app',
    data: {
        name: '',
        email: '',
        studentID: '',
        password: '',
        passwordConfirm: '',
        degree: '',
        message: ''
    },

    methods: {
        createAccount() {

            //Password regex. Assign boolean values to check if there is capital letter and a number in the password.
            let capitalCheck = false;
            let numberCheck = false;

            //If statements that checks if password has at least 10 characters
            if(this.password.length < 10){
                this.message = 'Password must contain at least 10 characters.';
                return;
            }

            //For loop that checks if password has at least 1 number
            for(let i=0; i< this.password.length; i++){
                if(this.password[i] === this.password[i].toUpperCase()){
                    capitalCheck = true;
                    break;
                }
            }

            if(!capitalCheck) {
                this.message = 'Password must contain at least 1 capital letter.';
                return;
            }

            //Checks if passwords match
            if (this.password !== this.passwordConfirm) {
                this.message = 'Passwords must match.';
                return;
            }


            axios.post('/create-account', {
                name: this.name,
                email: this.email,
                studentID: this.studentID,
                password: this.password,
                degree: this.degree
            })

            .then(response => {

                this.message = 'Account created!';

                this.name ='',
                this.email ='',
                this.studentID = '',
                this.password = '',
                this.passwordConfirm = '',
                this.degree = '';
            })

            .catch(error => {
                this.message = 'Account not created.';
                console.log(error);
            });
        }
    }
});
