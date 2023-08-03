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
const createJsonFileDB = require("jsonfiledb");

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

## API

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

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/mit/) info for details.
