# Race Data Web Project

This project is designed to organize and display race data, including information about races, drivers, and their performance. The application provides a user-friendly interface to access and explore this data.

## Project Structure

```
race-data-web
├── src
│   ├── data
│   │   └── race_data.json       # Contains race data in JSON format
│   ├── site
│   │   ├── index.html            # Main entry point of the website
│   │   ├── drivers.html          # Lists all current drivers
│   │   ├── scripts.js            # JavaScript for dynamic interactions
│   │   └── styles.css            # CSS styles for the website
├── package.json                   # Configuration file for npm
└── README.md                      # Documentation for the project
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd race-data-web
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   You can use a local server to serve the `index.html` file. For example, you can use the `live-server` package:
   ```
   npx live-server src/site
   ```

## Usage

- Open `index.html` in your web browser to view the main page.
- Navigate to `drivers.html` to see a list of all current drivers.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.

## License

This project is licensed under the MIT License.