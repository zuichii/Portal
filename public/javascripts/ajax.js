// ajax request to dynamically load the content of club_profile page
function getClubProfile(clubId) {
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', '/club_profile?id=' + clubId, true);

  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      var clubData = JSON.parse(this.responseText);

      document.getElementById('clubName').innerText = clubData.club_name;
      document.getElementById('clubStats').innerText = '@' + clubData.club_name + ' ' + clubData.num_members + ' MEMBERS ' + clubData.num_posts + ' POSTS';
    }
  };
  xhttp.send();
}
