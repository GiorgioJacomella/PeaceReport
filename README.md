# PeaceReport

PeaceReport is a platform for independent journalists to share unbiased news and stories about conflicts, aiming to promote understanding and peace.

## Project Structure

- **Client**: Contains the Next.js frontend.
- **Server**: Contains the ASP.NET Core backend.

## Frontend

The frontend is built using Next.js. Key packages include:

- **Next.js**: Framework for server-side rendering and static site generation.
- **React**: Library for building the user interface.
- **Tailwind CSS**: For styling the application.

You can find the complete list of dependencies in the `Client/package.json` file.

### Installation

To install the frontend dependencies, navigate to the `Client` directory and run:

```sh
npm install
```

### Running the Frontend
To run the frontend development server, use:
```sh
npm run dev
```

## Backend
The backend is built using C# and ASP.NET Core. Key requirements include:

- ASP.NET Core: Framework for building the web API.
- Entity Framework Core: For database interactions.

### Installation
To install the backend dependencies, navigate to the Server/PeaceReportServer directory and run:
```sh
dotnet run
```

To connect to a NoSQL database, adjustments need to be made in the configuration files. In ASP.NET Core, this is typically done in the appsettings.json.

Example configuration for MongoDB:
```sh
{
///Other configurations
  "ConnectionStrings": {
    "MongoDb": "mongodb://<username>:<password>@<host>:<port>/<database>"
  }
}

```

### Setting Up NoSQL Database Users
To set up a MongoDB database with read and write rights, follow these steps:

Create a new user with read and write permissions:

```sh
Code kopieren
use admin
db.createUser({
  user: "peaceReportUser",
  pwd: "password123",
  roles: [
    { role: "readWrite", db: "peaceReportDb" }
  ]
})
```
Ensure the user has the necessary privileges:
The user should have the readWrite role on the peaceReportDb database, granting them the ability to perform both read and write operations.
