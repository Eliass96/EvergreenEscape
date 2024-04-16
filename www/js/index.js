document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('butUser')) {
        console.log(localStorage.getItem('isLogged'))
        if (localStorage.getItem('isLogged') === 'true') {
            document.getElementById('butUser').setAttribute('href', '../html/profile.html');
        } else {
            document.getElementById('butUser').setAttribute('href', '../html/login.html');
        }
    }


});
