fetch('../data/race_data.json')
    .then(response => response.json())
    .then(data => {
        const driversList = document.getElementById('drivers');
        const sortOptions = document.getElementById('sort-options');
        const driverMap = new Map(); 
       
        // =============== Drivers Section ===================
        if (driversList) {
            data.forEach(entry => {
                if (
                    entry.full_name &&
                    entry.driver_number &&
                    entry.headshot_url && // Ensure headshot_url exists
                    typeof entry.headshot_url === 'string' && // Ensure it's a valid string
                    entry.headshot_url.trim() !== '' && // Ensure it's not empty
                    entry.team_name
                ) {
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
                        <div class="driver-info">
                            <img src="${driver.photo}" alt="${driver.name}">
                              <div class="driver-details">
                                 <strong>${driver.name}</strong>
                            </div>
                         </div>
                        <div class="driver-meta">
                             <div>Number: ${driver.number}</div>
                             <div>Team: ${driver.team}</div>
                         </div>
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

        // =============== Races Section ===================
        const racesList = document.getElementById('races');
        const toggleRaces = document.getElementById('toggle-races');
        if (racesList) {
            const races = new Map();
            const locationFilter = document.getElementById('location-filter');
        
           
            const locations = new Set();
            data.forEach(entry => {
                if (entry.session_key && entry.location && entry.year && entry.session_type) {
                    if (!races.has(entry.session_key)) {
                        races.set(entry.session_key, {
                            location: entry.location,
                            year: entry.year,
                            sessionType: entry.session_type,
                            drivers: []
                        });
                        locations.add(entry.location); 
                    }
            
                   
                    const race = races.get(entry.session_key);
            
                    
                    const driverExists = race.drivers.some(driver => driver.name === entry.full_name);
            
                    if (!driverExists) {
                        race.drivers.push({
                            name: entry.full_name,
                            position: entry.position
                        });
                    }
                }
            });
            //add location sortings
            locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                locationFilter.appendChild(option);
            });
        
            const renderRaces = (filterByRace = false, selectedLocation = 'all') => {
                racesList.innerHTML = '';
                races.forEach((race, sessionKey) => {
                    if (filterByRace && race.sessionType.toLowerCase() !== 'race') {
                        return;
                    }
                    if (selectedLocation !== 'all' && race.location !== selectedLocation) {
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
        
            
            renderRaces();
        
           
            toggleRaces.addEventListener('change', (event) => {
                const selectedLocation = locationFilter.value;
                renderRaces(event.target.checked, selectedLocation);
            });
        
            
            locationFilter.addEventListener('change', (event) => {
                const filterByRace = toggleRaces.checked;
                renderRaces(filterByRace, event.target.value);
            });
        }

        // =============== Graph Section ===================
       // f1 position to points mapping
        const pointsMap = {
            1: 25,
            2: 18,
            3: 15,
            4: 12,
            5: 10,
            6: 8,
            7: 6,
            8: 4,
            9: 2,
            10: 1
        };


        const placements = {};

        data.forEach(entry => {
            const driver = entry.full_name;
            const position = entry.position;

            if (!placements[driver]) {
                placements[driver] = [];
            }
            const points = pointsMap[position] || 0;
            placements[driver].push(points);
        });

        const averagePoints = Object.keys(placements).map(driver => {
            const total = placements[driver].reduce((sum, points) => sum + points, 0);
            const avg = total / placements[driver].length;
            return { driver, avg };
        });

        averagePoints.sort((a, b) => b.avg - a.avg); 

        const drivers = averagePoints.map(item => item.driver);
        const averages = averagePoints.map(item => item.avg);

        const ctx = document.getElementById('driverPerformanceChart')?.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: drivers,
                    datasets: [{
                        label: 'Average Points',
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