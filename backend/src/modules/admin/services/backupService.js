import fs from "fs";
import mongoose from "mongoose";

export const createBackup = async () => {
  const collections = await mongoose.connection.db
    .listCollections()
    .toArray();

  const backup = {};

  for (let col of collections) {
    const data = await mongoose.connection.db
      .collection(col.name)
      .find()
      .toArray();

    backup[col.name] = data;
  }

  const fileName = `backup-${Date.now()}.json`;

  fs.writeFileSync(fileName, JSON.stringify(backup));

  return fileName;
};