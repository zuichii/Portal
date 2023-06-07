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
    }
  };

  xhttp.open('GET', '/club_profile?id=' + clubId, true);
  xhttp.send();
}

window.addEventListener('DOMContentLoaded', getClubProfile);



