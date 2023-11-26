<template>
  <br><br>
  <div id="backcolour">
    <h1 style="text-align:center; margin-top: 30px;font-size: 45.8px;margin-bottom: 37px;font-weight: bold">
      Required Meal Plan
    </h1>

    <div class="card-container">
      <div class="card">
        <h1 style="font-weight: bold">Breakfast</h1>
        <p v-for="item in items.Breakfast" :key="item">{{ item }}</p>
        <!-- <input v-model="newBreakfastItem" id="newItem" class="form-control" placeholder="Enter new item" required>
        <button @click="addItem('Breakfast')" class="btn btn-primary"
          style="margin-top: 20px; margin-bottom: 30px; color: black; background: white; border: 1px solid #f0d8b6; width: 100%;"><b>Add
            Item</b></button> -->
      </div>

      <div class="card">
        <h1 style="font-weight: bold">Lunch</h1>
        <p v-for="item in items.Lunch" :key="item">{{ item }}</p>
        <!-- <input v-model="newLunchItem" id="newItem" class="form-control" placeholder="Enter new item" required>
        <button @click="addItem('Lunch')" class="btn btn-primary"
          style="margin-top: 20px; margin-bottom: 30px; color: black; background: white; border: 1px solid #f0d8b6; width: 100%;"><b>Add
            Item</b></button> -->
      </div>

      <div class="card">
        <h1 style="font-weight: bold">Dinner</h1>
        <p v-for="item in items.Dinner" :key="item">{{ item }}</p>
        <!-- <input v-model="newDinnerItem" id="newItem" class="form-control" placeholder="Enter new item" required>
        <button @click="addItem('Dinner')" class="btn btn-primary"
          style="margin-top: 20px; margin-bottom: 30px; color: black; background: white; border: 1px solid #f0d8b6; width: 100%;"><b>Add
            Item</b></button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import db from '../firebase/init.js';

export default {
  data() {
    return {
      items: {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getDocs(collection(db, 'meal_plan'))
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.items = doc.data();
            console.log(this.items);
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    addItem(mealType) {
      // Add the new item to the corresponding meal type array
      const newItem = this[`new${mealType}Item`];

      // Update the data in Firestore for the specific meal type
      const mealPlanRef = doc(db, 'meal_plan', 'QSTmGE3hPtRgPksQ1bpb'); // Replace 'your_document_id' with your actual document ID

      // Create an object with the specific field to update
      const updateObject = {};
      updateObject[mealType] = this.items[mealType];

      updateDoc(mealPlanRef, updateObject)
        .then(() => {
          console.log('Item added successfully',mealType);
        })
        .catch(error => {
          console.error('Error updating document:', error);
        });

      // Clear the input field
      this[`new${mealType}Item`] = '';
    },

  },
};
</script>

<style scoped>
.card {
  max-width: 300px;
  margin: auto;
  text-align: center;
  font-family: arial;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.price {
  color: grey;
  font-size: 22px;
}

.card button {
  border: none;
  outline: 0;
  padding: 12px;
  color: white;
  background-color: #000;
  text-align: center;
  cursor: pointer;
  width: 100%;
  font-size: 18px;
}

.card button:hover {
  opacity: 0.7;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
}

.card {
  flex: 1 0 30%;
  margin: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
}

.card img {
  width: 100%;
  height: auto;
}

@media (max-width: 768px) {
  .card {
    flex-basis: 45%;
  }

  .card-container[data-v-99a59d87] {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column-reverse;
    align-items: center;
  }

  .card-container[data-v-79d2af26] {
    margin-left: 8%;
  }
}

.card-container[data-v-99a59d87] {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: row;
  align-content: center;
  justify-content: center;
}

.card img[data-v-99a59d87] {
  width: 80%;
  HEIGHT: 80%;
  MARGIN-LEFT: 11%;
}

.card:hover {
  opacity: 0.7;
  background: rgba(240, 216, 182, 255);
}

h1,
.h1 {
  padding-top: 17px;
}

.card {
  margin-bottom: 50px;
}

#backcolour {
  background: white;
}

@media (min-width: 1200px) {
  .card-container {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-evenly;
  }

}
</style>