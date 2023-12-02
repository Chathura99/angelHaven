<template>
  <div class="container" style="background: #f8f8f8; border-radius: 10px;">
    <div class="section-title">
      <br>
      <h3 class="faqsection" style="font-size: 45.8px; font-weight: bold; margin-top: 40px;">Our Requirements</h3>
    </div>
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="mb-3">
          <label for="requiredItem" class="form-label">Required Item</label>
          <input v-model="requiredItem" id="requiredItem" class="form-control" placeholder="Enter Required Item" required>
        </div>
        <div class="mb-3">
          <label for="numberOfItems" class="form-label">Number of Items</label>
          <input v-model="numberOfItems" id="numberOfItems" class="form-control" placeholder="Enter Number of Items"
            required>
        </div>
        <button @click="saveItem" class="btn btn-primary"
          style="margin-top: 20px; margin-bottom: 30px; color: black; background: white; border: 1px solid #f0d8b6; width: 100%;"><b>Submit</b></button>

        <!-- List down all added items -->
        <h5>List of Requirements</h5>
        <ul>
          <li v-for="requirement in requirements" :key="requirement.id">
            <table>
              <tr>
                <td>{{ requirement.requiredItem }} - {{ requirement.numberOfItems }}</td>
                <td>
                  <!-- Add a delete button to remove the requirement -->
                  <button @click="removeRequirement(requirement.id)">Delete</button>

                </td>
              </tr>
            </table>


          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import db from '../firebase/init.js';

export default {
  data() {
    return {
      numberOfItems: '',
      requiredItem: '',
      requirements: [], // Array to store requirements
    };
  },
  methods: {
    async saveItem() {
      try {
        // Add data to 'requirements' collection
        const docRef = await addDoc(collection(db, 'requirements'), {
          requiredItem: this.requiredItem,
          numberOfItems: this.numberOfItems,
        });

        // Update UI by adding the saved requirement to the list
        this.requirements.push({
          id: docRef.id,
          requiredItem: this.requiredItem,
          numberOfItems: this.numberOfItems,
        });

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Requirement added successfully!'
        });
      } catch (error) {
        console.error('Error adding requirement:', error);
        alert('Error adding requirement. Please try again.');
      }
    },

    async fetchRequirements() {
      try {
        // Fetch all documents from 'requirements' collection
        const querySnapshot = await getDocs(collection(db, 'requirements'));

        // Update the requirements array with fetched data
        this.requirements = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error('Error fetching requirements:', error);
      }
    },

    async removeRequirement(requirementId) {
      try {
        // Remove the requirement from 'requirements' collection
        await deleteDoc(doc(db, 'requirements', requirementId));

        // Update UI by removing the deleted requirement from the list
        this.requirements = this.requirements.filter(req => req.id !== requirementId);

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Requirement deleted successfully!'
        });
      } catch (error) {
        console.error('Error deleting requirement:', error);
        alert('Error deleting requirement. Please try again.');
      }
    },
  },
  mounted() {
    // Fetch requirements when the component is mounted
    this.fetchRequirements();
  },
};
</script>

<style>
/* Add any necessary styles */
</style>
