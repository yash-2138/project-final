document.addEventListener('DOMContentLoaded', function () {
    // Fetch and insert the navbar.html content
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbarContainer').innerHTML = data;
        })
        .catch(error => console.error('Error fetching navbar.html:', error));
});
