fetch('../data/race_data.json')
    .then(response => response.json())
    .then(data => {
        // drivers
        const driversList = document.getElementById('drivers');
        if (driversList) {
            const drivers = new Map();

            data.forEach(entry => {
                if (entry.full_name && entry.driver_number && entry.headshot_url && entry.team_name) {
                    drivers.set(entry.driver_number, {
                        name: entry.full_name,
                        team: entry.team_name,
                        photo: entry.headshot_url,
                        number: entry.driver_number
                    });
                }
            });

            drivers.forEach(driver => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <img src="${driver.photo}" alt="${driver.name}">
                    <strong>${driver.name}</strong><span class="gap"> (Number: ${driver.number})<br>
                    Team: ${driver.team}
                `;
                driversList.appendChild(listItem);
            });
        }

        // races
        const racesList = document.getElementById('races');
        if (racesList) {
            const races = new Map();

            data.forEach(entry => {
                if (entry.session_key && entry.location && entry.year && entry.session_type) {
                    if (!races.has(entry.session_key)) {
                        races.set(entry.session_key, {
                            location: entry.location,
                            year: entry.year,
                            sessionType: entry.session_type,
                            drivers: []
                        });
                    }
                    races.get(entry.session_key).drivers.push({
                        name: entry.full_name,
                        position: entry.position
                    });
                }
            });

            races.forEach((race, sessionKey) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <strong>${race.location} (${race.year})</strong><br>
                    Session Type: ${race.sessionType}<br>
                    Drivers:<br>
                    <ul>
                        ${race.drivers
                            .map(
                                driver =>
                                    `<li>${driver.name} - Position: ${driver.position}</li>`
                            )
                            .join('')}
                    </ul>
                `;
                racesList.appendChild(listItem);
            });
        }
    })
    .catch(error => console.error('Error loading data:', error));