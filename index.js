const fs = require("fs");
const path = require("path");

/**
 * Represents a jsonFileDB instance.
 */
class jsonFileDB {
  /**
   * Path to the database folder.
   * @type {string}
   */
  dbPath;

  /**
   * Name of the storage file (without extension).
   * @type {string}
   */
  storage = null;

  /**
   * Complete path to the storage file (including extension).
   * @type {string}
   */
  storagePath = null;

  /**
   * Content of the storage file (read from file).
   * @type {string}
   */
  storageData = null;

  /**
   * ID of the last inserted record.
   * @type {string|null}
   */
  lastInsertId = null;

  /**
   * Initializes a new jsonFileDB instance.
   * @param {string} dbName - The name of the database.
   * @param {string} dbPath - The path to the database folder.
   * @throws {Error} Will throw an error if the database folder cannot be created.
   */
  constructor(dbName, dbPath = "") {
    // Get the absolute path of the current module
    const appRoot = path.resolve(__dirname, "../../../");

    // Combine the absolute path with the database name and path
    this.dbPath = dbPath === "" ? path.join(appRoot, dbName) : dbPath;

    // Ensure that the database folder exists, create it if it doesn't
    this.createDatabaseFolder();
  }

  /**
   * Set the storage file name and path.
   * @param {string} storage - The name of the storage file (without extension).
   * @returns {jsonFileDB} The jsonFileDB instance.
   */
  setStorage(storage) {
    this.storage = storage;
    this.storagePath = `${this.dbPath}/${this.storage}.json`;

    // Check if the JSON file exists, create it if it doesn't
    if (!fs.existsSync(this.storagePath)) {
      try {
        fs.writeFileSync(this.storagePath, "[]");
      } catch (err) {
        throw new Error(err);
      }
    }

    return this;
  }

  /**
   * Insert new data into the storage.
   * @param {Object} insertData - The data to be inserted into the storage.
   * @returns {Object} The inserted data.
   * @throws {Error} If no storage is selected.
   */
  async insert(insertData) {
    if (!this.storage) {
      throw new Error("No storage selected. Call setStorage() before insert()");
    }

    try {
      const id =
        insertData.id ||
        Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);

      insertData.id = id;
      this.lastInsertId = id;

      const data = await this.get();

      data.push(insertData);

      const jsonData = JSON.stringify(data);

      // Write the updated data to the storage file
      fs.writeFileSync(this.storagePath, jsonData);

      return insertData;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Get the last insert ID.
   * @returns {string} The last insert ID.
   * @throws {Error} If no insert has been executed.
   */
  insertId() {
    if (!this.lastInsertId) {
      throw new Error("No insert executed. Call insert() before insertId()");
    }

    return this.lastInsertId;
  }

  /**
   * Get the content of the storage file.
   * @param {string} storage - (Optional) The name of the storage file to read.
   * If not provided, the current storage will be used.
   * @returns {Array} The content of the storage file as an array of objects.
   */
  async get(storage = "") {
    if (storage !== "") {
      this.setStorage(storage);
    }
    try {
      const data = fs.readFileSync(this.storagePath, "utf8");
      fs.close(fs.openSync(this.storagePath, "r"));
      this.storageData = JSON.parse(data);
      return this.storageData;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Find records that match the specified query.
   * @param {Object} query - The query to match the records.
   * @returns {Array} An array of matched records.
   */
  async find(query) {
    const data = await this.get();
    return data.filter((item) => {
      return Object.keys(query).every((key) => {
        return item[key] === query[key];
      });
    });
  }

  /**
   * Update records that match the specified query with the given update data.
   * @param {Object} query - The query to match the records to be updated.
   * @param {Object} updateData - The data to update the matched records.
   * @returns {Array} The updated array of objects containing the matched records.
   */
  async update(query, updateData) {
    const data = await this.get();

    data.forEach((item) => {
      if (Object.keys(query).every((key) => item[key] === query[key])) {
        Object.keys(updateData).forEach((key) => {
          item[key] = updateData[key];
        });
      }
    });

    // Write the updated data to the storage file
    fs.writeFile(this.storagePath, JSON.stringify(data), (err) => {
      if (err) {
        throw new Error(err);
      }
    });

    return data;
  }

  /**
   * Delete records that match the specified query.
   * @param {Object} query - The query to match the records to be deleted.
   * @returns {Array} An array of deleted records.
   */
  async delete(query) {
    const data = await this.get();

    const deletedData = [];
    const filteredData = data.filter((item) => {
      const isMatched = Object.keys(query).every(
        (key) => item[key] === query[key]
      );
      if (isMatched) {
        deletedData.push(item);
      }
      return !isMatched;
    });

    // Write the filtered data (after deletion) to the storage file
    fs.writeFile(this.storagePath, JSON.stringify(filteredData), (err) => {
      if (err) {
        throw new Error(err);
      }
    });

    return deletedData;
  }

  /**
   * Helper method to create the database folder if it doesn't exist.
   */
  createDatabaseFolder() {
    try {
      fs.mkdirSync(this.dbPath, { recursive: true });
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = (dbName, dbPath) => {
  return new jsonFileDB(dbName, dbPath);
};
