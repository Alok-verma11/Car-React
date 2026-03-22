import { Client, Account, Databases, Storage, ID } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(import.meta.env.VITE_PROJECT_ID); 

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };

// IDs for easy access 
export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
export const BUCKET_ID = import.meta.env.VITE_BUCKET_ID;
export const BOOKINGS_COLLECTION_ID = "Bookings";
export const CARS_COLLECTION_ID = "Cars";
