# Movie Time for You 🎬

**Movie Time for You** is a React-based web application that allows users to explore, search, and watch movies from various genres and categories. This app pulls data from an API to display the latest movies, shows, and animations from different regions and genres.

## Features

- **Browse Movies**: Users can browse movies and shows by category, genre, or country.
- **Search Functionality**: Powerful search allows users to find movies quickly.
- **Detailed Movie Info**: Get detailed information about each movie such as title, description, genre, country, and year of release.
- **Embedded Video Player**: Movies are embedded with an HLS player that supports `.m3u8` streams for a smooth viewing experience.
- **Pagination Support**: Browse through a large collection of movies with paginated results for easy navigation.

## Tech Stack

- **Frontend**: React, Ant Design
- **Video Player**: HLS.js for streaming `.m3u8` video files
- **Routing**: React Router DOM
- **Data Fetching**: Axios for API requests

## API Integration

This app fetches data from an external movie API to display movie details, categories, and search results.

## How to Run Locally

1. Clone the repository:
    ```bash
    git clone https://github.com/neit272/movie-time-for-you.git
    ```

2. Navigate into the project directory:
    ```bash
    cd movie-time-for-you
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm start
    ```

5. Open your browser and go to [http://localhost:3000](http://localhost:3000) to see the app in action.

## Deployment

This project is deployed using GitHub Pages. To deploy the app, the following npm scripts are available:

- To build the app:
  ```bash
  npm run build
  ```

- To deploy to GitHub Pages:
  ```bash
  npm run deploy
  ```

You can view the live app [here](https://neit272.github.io/movie-time-for-you).

## Future Enhancements

- Ad Detection and Skipping: Implementing automatic ad detection and skipping in the video player.
or
- Changing to use the ads-free source (?)

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue to discuss any potential improvements or bug fixes.

## Enjoy watching your favorite movies! 🎥🍿