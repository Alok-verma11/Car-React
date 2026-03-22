import { Client, Account, Databases, Storage, ID } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("69bfe5a60000d905da24"); // Aapka Project ID

export const account = new Account(client);
export const databases = new Databases(client);

// Is line ko dhyan se check karein, yahi missing thi
export { ID };

// IDs for easy access
export const DATABASE_ID = "69bfe5e0001ed1db92bf";
export const storage = new Storage(client);
export const BUCKET_ID = "69c00d3d0039e3b68e8d";
export const BOOKINGS_COLLECTION_ID = "Bookings";
export const CARS_COLLECTION_ID = "Cars";
