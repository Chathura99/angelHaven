<template>
  <br><br><br>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body">
            <div class="section-title">
              <h3 class="faqsection" style="font-size: 45.8px; font-weight: bold; margin-top: 60px;">Materials </h3>
            </div>
            <table class="table table-striped table-mobile-responsive table-mobile-sided">
              <thead>
                <tr>
                  <th scope="col">Product ID</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Product Quantity</th>
                  <th scope="col">Product Unit</th>
                  <th scope="col">Update Quantity</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.productId }}</td>
                  <td>{{ item.productName }}</td>
                  <td>{{ item.productQuantity }}</td>
                  <td>{{ item.productUnit }}</td>
                  <td>
                    <input v-model="item.updatedQuantity" type="number" min="0" step="1" />
                  </td>
                  <td>
                    <button @click="updateQuantity(item)" class="bg-blue-500 hover:bg-blue-600 absolute top-0 left-1/2 transform -translate-x-1/2 mt-2 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Update Quantity</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <br>
</template>

<script>
import { collection, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import db from '../firebase/init.js';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    this.fetchData();

    // Set up a real-time listener to update data when changes occur
    const productCollectionRef = collection(db, 'product');
    onSnapshot(productCollectionRef, (snapshot) => {
      this.items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, updatedQuantity: 0 }));
    });
  },
  methods: {
    async updateQuantity(item) {
      try {
        const productDocRef = doc(db, 'product', item.id);
        // Update the product quantity using the value from "updatedQuantity"
        await updateDoc(productDocRef, { productQuantity: item.updatedQuantity });
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Product quantity updated successfully!',
        });
      } catch (error) {
        console.error('Error updating product quantity:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to update product quantity. Please try again.',
        });
      }
    },
    fetchData() {
      getDocs(collection(db, 'product'))
        .then(querySnapshot => {
          this.items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, updatedQuantity: 0 }));
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
  },
};
</script>
