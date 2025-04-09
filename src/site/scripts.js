fetch('../data/race_data.json')
    .then(response => response.json())
    .then(data => {
        const driversList = document.getElementById('drivers');
        const sortOptions = document.getElementById('sort-options');
        const driverMap = new Map(); 
       

        if (driversList) {
            data.forEach(entry => {
                if (entry.full_name && entry.driver_number && entry.headshot_url && entry.team_name) {
                    if (!driverMap.has(entry.driver_number)) {
                        driverMap.set(entry.driver_number, {
                            name: entry.full_name,
                            team: entry.team_name,
                            photo: entry.headshot_url,
                            number: entry.driver_number
                        });
                    }
                }
            });

            const driverList = Array.from(driverMap.values());

            const renderDrivers = (sortedDrivers) => {
                driversList.innerHTML = ''; 
                sortedDrivers.forEach(driver => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <img src="${driver.photo}" alt="${driver.name}">
                        <strong>${driver.name}</strong> (Number: ${driver.number})<br>
                        Team: ${driver.team}
                    `;
                    driversList.appendChild(listItem);
                });
            };

            const sortByNumber = () => driverList.sort((a, b) => a.number - b.number);

            const sortByName = () => driverList.sort((a, b) => {
                const lastNameA = a.name.split(' ').slice(-1)[0].toLowerCase();
                const lastNameB = b.name.split(' ').slice(-1)[0].toLowerCase();
                return lastNameA.localeCompare(lastNameB);
            });

            const sortByTeam = () => driverList.sort((a, b) => a.team.localeCompare(b.team));

            if (sortOptions) {
                sortOptions.addEventListener('change', (event) => {
                    if (event.target.value === 'number') {
                        sortByNumber();
                    } else if (event.target.value === 'name') {
                        sortByName();
                    } else if (event.target.value === 'team') {
                        sortByTeam();
                    }
                    renderDrivers(driverList);
                });
            }

            // this is the default when loading the page (just sorts by number)
            sortByNumber();
            renderDrivers(driverList);
        }

        // Races Section
        const racesList = document.getElementById('races');
        const toggleRaces = document.getElementById('toggle-races');
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

            const renderRaces = (filterByRace = false) => {
                racesList.innerHTML = ''; 
                races.forEach((race, sessionKey) => {
                    if (filterByRace && race.sessionType.toLowerCase() !== 'race') {
                        return;
                    }
        
                    // Sort drivers by position (ascending)
                    race.drivers.sort((a, b) => a.position - b.position);
        
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
            };
            //init state
            renderRaces();

            toggleRaces.addEventListener('change', (event) => {
                renderRaces(event.target.checked); 
            });
        }


        // Graph on Home Page
        const placements = {};

        data.forEach(entry => {
            const driver = entry.full_name;
            const position = entry.position;

            if (!placements[driver]) {
                placements[driver] = [];
            }
            placements[driver].push(position);
        });

        const averagePositions = Object.keys(placements).map(driver => {
            const total = placements[driver].reduce((sum, pos) => sum + pos, 0);
            const avg = total / placements[driver].length;
            return { driver, avg };
        });

        averagePositions.sort((a, b) => a.avg - b.avg);

        const drivers = averagePositions.map(item => item.driver);
        const averages = averagePositions.map(item => item.avg);

        const ctx = document.getElementById('driverPerformanceChart')?.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: drivers,
                    datasets: [{
                        label: 'Average Position',
                        data: averages,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                        }
                    }
                }
            });
        }
    })
    .catch(error => console.error('Error loading data:', error));