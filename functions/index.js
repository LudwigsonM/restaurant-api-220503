import functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import { getAllRestaurants, getRestaurantById, deleteRestaurant,
  updateRestaurant, addRestaurant, updateRestaurantRating } from './src/restaurants.js';

const app = express();
app.use(cors());
app.use(express.json());

// setup my routes
app.get('/restaurants', getAllRestaurants);
app.get('/restaurants/:restaurantId', getRestaurantById);
app.delete('/restaurants/:restaurantId', deleteRestaurant);
app.patch('/restaurants/:restaurantId', updateRestaurant);
app.patch('/restaurants/:restaurantId/rating', updateRestaurantRating);
app.post('/restaurants', addRestaurant);

export const api = functions.https.onRequest(app);
