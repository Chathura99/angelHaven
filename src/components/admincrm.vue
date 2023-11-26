<template>
  <br><br><br>
  <div class="container">
    <div class="section-title">
      <h3 class="faqsection" style="font-size: 45.8px; font-weight: bold; margin-top: 60px;">Inventory Management</h3>
    </div>
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="mb-3">
          <label for="productId" class="form-label">Product ID</label>
          <input readonly v-model="productId" id="productId" class="form-control" placeholder="Enter Product ID" required>
        </div>
        <div class="mb-3">
          <label for="productName" class="form-label">Product Name</label>
          <input v-model="productName" id="productName" class="form-control" placeholder="Enter Product Name" required>
        </div>
        <div class="mb-3">
          <label for="productQuantity" class="form-label">Product Quantity</label>
          <input v-model="productQuantity" type="number" id="productQuantity" class="form-control"
            placeholder="Enter Product Quantity" required>
        </div>
        <div class="mb-3">
          <label for="productQuantity" class="form-label">Product Unit</label>
          <input v-model="productUnit" id="productUnit" class="form-control"
            placeholder="Enter Product Unit (kg,ml,l,packets)" required>
        </div>
        <button @click="createProduct" class="btn btn-primary"
          style="margin-top: 20px; color: black; background: white; border: 1px solid #f0d8b6; width: 100%;"><b>Add</b></button>
        <!-- <button @click="updateProduct" class="btn btn-primary"
          style="margin-top: 20px; margin-bottom: 0px; color: black; background: white; border: 1px solid #f0d8b6; width: 100%;"><b>Update</b></button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { collection, addDoc, doc, updateDoc, getDoc, where, query, getDocs ,orderBy, limit } from "firebase/firestore";
import db from '../firebase/init.js';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      productId: '',
      productName: '',
      productQuantity: '',
      productCreated: false,
      productUpdated: false,
      productData: {},
      productUnit: ''
    };
  },

  methods: {
    async createProduct() {
      // Calculate the next product ID
      const nextProductId = await this.getNextProductId();

      const colRef = collection(db, 'product');
      const dataObj = {
        productId: nextProductId,
        productName: this.productName,
        productQuantity: this.productQuantity,
        productUnit: this.productUnit
      };

      const docRef = await addDoc(colRef, dataObj);
      console.log('Document was created with ID:', docRef.id);

      this.productCreated = true;
      this.productData = dataObj;
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product added successfully!'
      });
    },

    async getNextProductId() {
      // Fetch existing product IDs and find the next available one
      const colRef = collection(db, 'product');
      const querySnapshot = await getDocs(query(colRef, orderBy('productId', 'desc'), limit(1)));

      let nextProductId = 'P001'; // Default if no products exist

      if (!querySnapshot.empty) {
        const latestProduct = querySnapshot.docs[0].data();
        const lastProductId = latestProduct.productId;
        const lastNumber = parseInt(lastProductId.substring(1), 10);
        nextProductId = 'P' + ('000' + (lastNumber + 1)).slice(-3);
      }

      return nextProductId;
    },

    async updateProduct() {


      const userQuery = query(collection(db, 'product'), where('productId', '==', this.productId));
      const docSnapshot = await getDoc(userQuery);


      if (docSnapshot.exists()) {
        await updateDoc(docRef, {
          productName: this.productName,
          productQuantity: this.productQuantity
        });

        console.log('Document was updated');

        this.productUpdated = true;
        this.productData = {
          productId: this.productId,
          productName: this.productName,
          productQuantity: this.productQuantity,
          productUnit: this.productUnit
        };

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Product updated successfully!'
        });

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Product does not exist!'
        });
      }
    }
  }
};
</script>



