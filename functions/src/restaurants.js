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