<template>
  <div class="container" style="background: #f8f8f8; border-radius: 10px;">
    <div class="section-title">
      <br>
      <h3 class="faqsection" style="font-size: 45.8px; font-weight: bold; margin-top: 40px;">My Profile</h3>
    </div>
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="mb-3">
          <label for="firstName" class="form-label">First Name</label>
          <input v-model="firstName" id="firstName" class="form-control" placeholder="Enter First Name" required>
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label">Last Name</label>
          <input v-model="lastName" id="lastName" class="form-control" placeholder="Enter Last Name" required>
        </div>
        <div class="mb-3">
          <label for="contact" class="form-label">Contact Number</label>
          <input v-model="contact" type="number" id="contact" class="form-control" placeholder="Enter Contact Number"
            required>
        </div>

        <div class="mb-3">
          <label for="position" class="form-label">Position</label>
          <input v-model="position" id="position" class="form-control" placeholder="Enter Position" required>
        </div>

        <button @click="saveProfile" class="btn btn-primary"
          style="margin-top: 20px; margin-bottom: 30px; color: black; background: white; border: 1px solid #f0d8b6; width: 100%;"><b>Submit</b></button>

      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import db from '../firebase/init.js';

export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      contact: '',
      position: '',
    };
  },
  mounted() {
    // Fetch the current user data when the component is mounted
    this.fetchUserData();
  },

  methods: {
    async saveProfile() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const dataObj = {
          firstName: this.firstName,
          lastName: this.lastName,
          contact: this.contact,
          position: this.position,
        };

        try {
          // Update the user's profile in Firestore
          await updateDoc(userDocRef, dataObj);
          
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Profile updated successfully!'
          });
        } catch (error) {
          console.error('Error updating profile:', error);
          alert('Error updating profile. Please try again.');
        }
      }
    },

    async fetchUserData() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is logged in, fetch user data from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              // Set the firstName, lastName, contact, and position based on the fetched user data
              const userData = userDoc.data();
              this.firstName = userData.firstName;
              this.lastName = userData.lastName;
              this.contact = userData.contact;
              this.position = userData.position;
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      });
    }
  },
};
</script>
