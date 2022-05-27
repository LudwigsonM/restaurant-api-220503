import e from "express";
import connectDb from "../connectDb.js";

export function getAllRestaurants(req, res) {
  const db = connectDb();
  db.collection("restaurants").get()
    .then(snapshot => {
      const restaurantArray = snapshot.docs.map(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        return restaurant;
      });
      res.send(restaurantArray);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

export function getRestaurantById(req, res) {
  const { restaurantId } = req.params;
  if(!restaurantId) {
    res.status(401).send('Invalid request');
    return;
  }
  const db = connectDb();
  db.collection("restaurants").doc(restaurantId).get()
    .then(doc => {
      let restaurant = doc.data();
      restaurant.id = doc.id;
      res.send(restaurant);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

export function addRestaurant(req, res) {
  if(!req.body) {
    res.status(401).send('Invalid request');
    return;
  }
  const db = connectDb();
  db.collection('restaurants').add(req.body)
    .then(doc => {
      res.send('Restaurant created ' + doc.id)
    })
    .catch(err => {
      res.status(500).send(err);
    });
}



export function updateRestaurant(req, res) {
  if(!req.params || !req.params.restaurantId || !req.body) {
    res.status(401).send('Invalid request');
    return;
  }
  const { restaurantId } = req.params;
  const db = connectDb();
  db.collection('restaurants').doc(restaurantId).update(req.body)
    .then(() => {
      res.send('Restaurant updated.');
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

export function deleteRestaurant(req, res) {
  const { restaurantId } = req.params;
  if(!restaurantId) {
    res.status(401).send('Invalid request');
    return;
  }
  const db = connectDb();
  db.collection("restaurants").doc(restaurantId).delete()
    .then(() => {
      res.send('Restaurant deleted.');
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

export function updateRestaurantRating(req, res){ 
  const { restaurantId } = req.params;
  if(!req.body || !req.body.rating || req.body.rating > 5 || req.body.rating < 0) {
      //problem 
    res.status(401).send('Improper Input');
    return;
  }
  const newRating = req.body.rating;
  const db = connectDb();

  // getting the restaurant (hitting  Firestore)
db.collection('restaurants').doc(restaurantId).get()
    .then( doc => {
      const { ratingList } = doc.data();
      // do maths(doing  JS)
      const newRatingList = (ratingList) ? [... ratingList, newRating] : [newRating];
      const numRatings = newRatingList.length;
      const rating = newRatingList.reduce((accum, elem) => accum + elem, 0) / numRatings;
      const updatedData = { ratingList: newRatingList, numRatings, rating }
      // save restaurant (hitting Firestore)
      db.collection('restaurants').doc(restaurantId).update(updatedData)
        .then(() => getRestaurantById(req, res))
      // option 1: 
      // return the updated restaurant
      // option 2: 
      // return success true/false
    })
    .catch( err => {
      res.status(500).send(err);
      return;
    })
}