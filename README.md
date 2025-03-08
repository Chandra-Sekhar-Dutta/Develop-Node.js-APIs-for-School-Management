# School Management API

This project is a simple Node.js application that provides an API for managing schools. It allows you to add schools and list them sorted by proximity to a given location.

## Project Structure

```
.env
.gitIgnore
database.js
package.json
school.js
```

## Prerequisites

- Node.js
- npm (Node Package Manager)
- MySQL

## Installation

1. Clone the repository:

    ```sh
    git clone <repository-url>
    ```

2. Navigate to the project directory:

    ```sh
    cd Assingment
    ```

3. Install the dependencies:

    ```sh
    npm install
    ```

4. Set up the environment variables:

    Create a `.env` file in the root directory with the following content:

    ```env
    MY_SQL_HOST='localhost'
    MY_SQL_USER='root'
    MY_SQL_PASSWORD='yourpassword'
    MY_SQL_DATABASE='school'
    PORT=3000
    ```

5. Set up the MySQL database:

    Create a MySQL database named `school` and a table named `schools` with the following structure:

    ```sql
    CREATE TABLE schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude DECIMAL(9,6) NOT NULL,
        longitude DECIMAL(9,6) NOT NULL
    );
    ```

## Usage

1. Start the server:

    ```sh
    node school.js
    ```

2. The server will be running on `http://localhost:3000`.

## API Endpoints

### Add a School

- **URL:** `/addSchool`
- **Method:** `POST`
- **Body Parameters:**
    - `name` (string): The name of the school.
    - `address` (string): The address of the school.
    - `latitude` (number): The latitude of the school's location.
    - `longitude` (number): The longitude of the school's location.
- **Response:**
    - `201 Created`: School added successfully.
    - `400 Bad Request`: Missing or invalid fields.
    - `500 Internal Server Error`: Error adding the school.

### List Schools Sorted by Proximity

- **URL:** `/listSchools`
- **Method:** `GET`
- **Query Parameters:**
    - `latitude` (number): The latitude of the user's location.
    - `longitude` (number): The longitude of the user's location.
- **Response:**
    - `200 OK`: List of schools sorted by proximity.
    - `400 Bad Request`: Missing or invalid query parameters.
    - `500 Internal Server Error`: Error retrieving the schools.

## License

This project is licensed under the MIT License.
