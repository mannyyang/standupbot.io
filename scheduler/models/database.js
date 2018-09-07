import mongoose from 'mongoose';

const server = 'mongo:27017';
const database = 'team';
class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(`mongodb://${server}/${database}`)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch(err => {
        console.error('Database connection error');
      });
  }
}

module.exports = new Database();
