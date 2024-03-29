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

// rsvp button
const rsvpButton = document.getElementById('rsvp-button');
const rsvpOptions = document.getElementsById('rsvp-options');

rsvpButton.addEventListener('click', () => {
    rsvpOptions.classList.toggle('hidden');
});

// toggles for displaying user information on dashboard
function toggleEditField(fieldId) {
    var textField = document.getElementById(fieldId);
    var inputField = document.getElementById(fieldId + "-input");

    if (textField.style.display === "none") {
        textField.style.display = "block";
        inputField.style.display = "none";
    } else {
        textField.style.display = "none";
        inputField.style.display = "block";
    }
}

// function to remove club_id
function removeClub(clubId) {
    var club = document.getElementById(clubId);
    club.parentNode.removeChild(club);
}



