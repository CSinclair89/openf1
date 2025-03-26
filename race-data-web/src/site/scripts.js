// filepath: c:\Users\msmar\OneDrive\Desktop\class work\312\openf1\src\site\scripts.js

document.addEventListener('DOMContentLoaded', function() {
    fetchRaceData();
});

function fetchRaceData() {
    fetch('../data/race_data.json')
        .then(response => response.json())
        .then(data => {
            displayDrivers(data);
        })
        .catch(error => console.error('Error fetching race data:', error));
}

function displayDrivers(data) {
    const driversList = document.getElementById('drivers-list');
    const drivers = data.map(driver => {
        return `<li>${driver.full_name} (Driver Number: ${driver.driver_number})</li>`;
    }).join('');
    driversList.innerHTML = drivers;
}