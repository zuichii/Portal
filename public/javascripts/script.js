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

const rsvpButton = document.getElementById('rsvp-button');
const rsvpOptions = document.getElementsById('srvp-options');

rsvpButton.addEventListener('click', () => {
    rsvpOptions.classList.toggle('hidden');
});

const optionButtons = document.querySelectorAll('.option');

optionButtons.forEach(button => {
    button.addEventListener('click', () => {
        alert('You clicked ${button.textContent}!');
    });
});