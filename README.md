# jsonFileDB - Lightweight Database Library for Node.js

![npm](https://img.shields.io/npm/v/@webcoader/jsonfiledb) ![license](https://img.shields.io/npm/l/@webcoader/jsonfiledb)

jsonFileDB is a lightweight and flexible database library for Node.js that simplifies data management with JSON-based storage files. It enables you to create and manage databases within a configured folder, where each database can have multiple tables, referred to as "storage," with individual JSON files for storing data. With jsonFileDB, you can perform essential CRUD (Create, Read, Update, Delete) operations on data, making it ideal for building data-driven applications with ease.

## Features

- **Simple Database Management**: Create databases in a designated folder and organize data in multiple tables (storage) using JSON files.

- **CRUD Operations**: Effortlessly insert, retrieve, update, and delete records in the databases.

- **Flexible Storage**: Easily switch between different storage files to manage data for different purposes.

- **Auto-generated IDs**: Automatically generate unique IDs for records during insertion if not provided.

- **Querying Records**: Find and retrieve records based on custom queries.

- **Data Integrity**: Ensure data integrity and consistency with well-defined methods.

## Installation

```bash
npm install @webcoader/jsonfiledb
```

## Usage Example

Here's an example of how you can perform CRUD operations using jsonFileDB in a Node.js application:

```javascript
const createJsonFileDB = require("@webcoader/jsonfiledb");

async function main() {
  // Create a new jsonFileDB instance
  const db = createJsonFileDB("my_database");

  // Set the storage to "users"
  db.setStorage("users");

  // Insert a new user
  const newUser = await db.insert({
    name: "John Doe",

    email: "john@example.com",

    age: 28,
  });

  console.log("New User Inserted:", newUser);

  // Find records based on query
  const foundUsers = await db.find({ age: 28 });

  console.log("Found Users:", foundUsers);

  // Update records based on query
  const updatedUser = await db.update({ name: "John Doe" }, { age: 29 });

  console.log("Updated User:", updatedUser);

  // Delete records based on query
  const deletedUsers = await db.delete({ age: 29 });

  console.log("Deleted Users:", deletedUsers);
}

main().catch((error) => {
  console.error("Error:", error);
});
```

Please note that you should wrap the jsonFileDB operations inside an async function to use the `await` keyword for asynchronous operations.

## Using Multiple Instances of jsonFileDB

You can create and use multiple instances of `jsonFileDB` to manage multiple databases or data storage files within your Node.js application. Each instance of `jsonFileDB` represents a separate database, allowing you to keep data organized and segregated. Here's how you can use multiple instances:

```javascript
const createJsonFileDB = require("@webcoader/jsonfiledb");

async function main() {
  // Create an instance for the first database ("db1")
  const db = createJsonFileDB("db1");

  // Create another instance for the second database ("db2")
  // Specify the custom database folder path as "db"
  const db2 = createJsonFileDB("db2", "db");

  // Set the storage for the first database to "users"
  db.setStorage("users");

  // Insert a new user into the first database
  const newUser = await db.insert({
    name: "John Doe",
    email: "john@example.com",
    age: 28,
  });

  // Set the storage for the second database to "posts"
  db2.setStorage("posts");

  // Insert a new post into the second database
  const newPost = await db2.insert({
    title: "Hello World",
    content: "Test content",
  });

  console.log("New User Inserted:", newUser);
  console.log("New Post Inserted:", newPost);
}

main().catch((error) => {
  console.error("Error:", error);
});
```

In this example, two separate instances of jsonFileDB are created: db for the first database and db2 for the second database. You can then use these instances to interact with their respective databases and perform CRUD operations as needed. Remember that each instance of jsonFileDB maintains its own set of storage files and manages data independently.

## API

### `createJsonFileDB(dbName, dbPath = "")`

Creates a new jsonFileDB instance with the specified database name and optional custom database folder path.

- `dbName` (string): The name of the database. This parameter is required and should be a string that uniquely identifies your database.
- `dbPath` (string, optional): The path to the database folder. By default, the database folder is created in the root directory where the `package.json` file is placed. If you want to set a custom database folder path, you can provide an absolute path as the `dbPath` parameter. This allows you to store the database files in a specific location within your application. If not provided, the default root directory will be used.

Example:

```javascript
const createJsonFileDB = require("@webcoader/jsonfiledb");

// Create a new jsonFileDB instance with the database name "my_database"
const db = createJsonFileDB("my_database");

// To set a custom database folder path (e.g., "data/databases")
const customDbPath = path.join(__dirname, "data", "databases");
const customDb = createJsonFileDB("custom_db", customDbPath);`
```

Using the `createJsonFileDB` function, you can create multiple instances of jsonFileDB, each representing a different database with its own set of storage files. The `dbPath` parameter allows you to manage the location of the database folder as needed.

It's important to note that the `dbPath` parameter is optional, and if not provided, the default database folder will be created in the root directory of your Node.js application.

### `setStorage(storage)`

Set the active storage file for the current database. If the file does not exist, it will be created as an empty array.

### `insert(insertData)`

Insert a new record into the active storage file. The record is a JSON object with key-value pairs.

### `insertId()`

Get the ID of the last inserted record.

### `get(storage = "")`

Retrieve all records from the active storage file or the specified storage.

### `find(query)`

Find records that match the specified query in the active storage file.

### `update(query, updateData)`

Update records that match the specified query in the active storage file. The updateData will modify the matched records accordingly.

### `delete(query)`

Delete records that match the specified query in the active storage file. The function returns the deleted records.

## Nodemon Users

This section is for users who are using Nodemon in their Node.js application. By default, the database folder is created in the root directory where the `package.json` file is placed by default. However, you can configure Nodemon to ignore the database folder to prevent it from triggering unnecessary restarts when the database files are modified.

To ignore the database folder, you can add the following configuration to your `nodemon.json` file:

```json
{
  "ignore": ["database/"]
}
```

This configuration tells Nodemon to ignore any changes made to files and folders inside the `database` directory. Replace `database/` with the actual path to your database folder if it's different.

By adding this configuration, Nodemon will no longer restart the application when changes are made to the database files, ensuring smooth development without unnecessary interruptions.

`NOTE:` The provided configuration is optional, particularly if you are utilizing a custom database save path located outside the application's root directory.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/mit/) info for details.
