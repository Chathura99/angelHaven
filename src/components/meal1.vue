<template>
  <div class="container" style="background: #f8f8f8; border-radius: 10px;">
    <div class="section-title">
      <br>
      <h3 class="faqsection" style="font-size: 45.8px; font-weight: bold; margin-top: 40px;">Booking (Donate)</h3>
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
          <input v-model="contact" type="number" id="contact" class="form-control" placeholder="Enter Contact Number" required>
        </div>
        <div class="mb-3">
          <label for="dateInput" class="form-label">Date</label>
          <input type="date" v-model="dateInput" id="dateInput" class="form-control" required>
        </div>

        <!-- <div class="mb-3">
          <button @click="searchBookings" class="btn btn-secondary"
            style="margin-top: 20px; color: white; background: #6c757d; border: 1px solid #6c757d; width: 100%;"><b>Search Bookings</b></button>
        </div> -->

        <div v-if="bookings && bookings.length > 0" class="mt-4">
          <h4 class="mb-3">Bookings for {{ dateInput }}</h4>
          <ul>
            <li v-for="(booking, index) in bookings" :key="index">
              <strong>{{ booking.firstName }} {{ booking.lastName }}</strong> - {{ booking.meal }}
            </li>
          </ul>
        </div>
        <div v-else class="mt-4">
          <p>No bookings found for the selected date.</p>
        </div>

        <div class="mb-3">
          <label for="Meal" class="form-label">Meal Type</label>
          <select v-model="meal" id="Meal" class="form-select" required>
            <option value="" disabled>Select Meal Type</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>

        <button @click="createBooking" class="btn btn-primary"
          style="margin-top: 20px; margin-bottom: 30px; color: black; background: white; border: 1px solid #f0d8b6; width: 100%;"><b>Submit</b></button>

      </div>
    </div>
  </div>
</template>

<script>
import { collection, addDoc, getDoc, doc, query, where, getDocs } from "firebase/firestore";
import db from '../firebase/init.js';
import Swal from 'sweetalert2';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      contact: '',
      dateInput: new Date().toISOString().substr(0, 10),
      meal: 'Breakfast',
      position: '',
      userCreated: false,
      userData: {},
      bookings: [],
    };
  },
  watch: {
    // Watch for changes in dateInput and call searchBookings
    dateInput: 'searchBookings',
  },
  mounted() {
    // Fetch the current user data when the component is mounted
    this.fetchUserData();
  },
  methods: {
    async createBooking() {
      const colRef = collection(db, 'booking');

      // Check if a booking already exists for the specified dateInput and meal
      const existingBookingQuery = query(
        colRef,
        where('dateInput', '==', this.dateInput),
        where('meal', '==', this.meal)
      );

      const existingBookingSnapshot = await getDocs(existingBookingQuery);

      if (!existingBookingSnapshot.empty) {
        // A booking already exists for the specified dateInput and meal
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Booking already exists for this date and meal.',
        });
        return; // Stop further execution
      }

      const dataObj = {
        firstName: this.firstName,
        lastName: this.lastName,
        contact: this.contact,
        dateInput: this.dateInput,
        meal: this.meal,
        position: this.position,
        status: 'Pending',
        uid:this.uid
      };

      const docRef = await addDoc(colRef, dataObj);
      console.log('Document was created with ID:', docRef.id);

      this.userCreated = true;
      this.userData = dataObj;

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Booking successfully!'
      });

      // Clear form data after submission
      this.firstName = '';
      this.lastName = '';
      this.contact = '';
      this.dateInput = '';
      this.meal = '';
      this.position = '';
      this.uid = '';
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
              // Set the firstName and lastName based on the fetched user data
              const userData = userDoc.data();
              this.firstName = userData.firstName;
              this.lastName = userData.lastName;
              this.contact = userData.contact;
              this.uid = userData.uid;
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      });
    },
    async searchBookings() {
      const colRef = collection(db, 'booking');

      // Fetch bookings for the selected dateInput
      const bookingsQuery = query(
        colRef,
        where('dateInput', '==', this.dateInput)
      );

      try {
        const bookingsSnapshot = await getDocs(bookingsQuery);

        if (bookingsSnapshot.empty) {
          this.bookings = []; // Clear previous bookings
          // Swal.fire({
          //   icon: 'info',
          //   title: 'Info',
          //   text: 'No bookings found for the selected date.',
          // });
          return;
        }

        // Extract and set booking details
        this.bookings = bookingsSnapshot.docs.map((doc) => doc.data());
        console.log('Bookings:', this.bookings);

      } catch (error) {
        console.error('Error fetching bookings:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch bookings. Please try again.',
        });
      }
    },
  },
};
</script>
