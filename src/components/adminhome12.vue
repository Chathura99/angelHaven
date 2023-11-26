<template>
  <br>
  <div class="container">
    <div class="section-title">
      <h3 class="faqsection" style="font-size: 45.8px; font-weight: bold; margin-top: 40px;">Current Booking Details</h3>
    </div>

    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body">
            <table class="table table-striped table-mobile-responsive table-mobile-sided">
              <thead>
                <tr>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Date</th>
                  <th scope="col">Meal</th>
                  <th scope="col">Contact</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index">
                  <td>{{ item.firstName }}</td>
                  <td>{{ item.lastName }}</td>
                  <td>{{ item.dateInput }}</td>
                  <td>{{ item.meal }}</td>
                  <td>{{ item.contact }}</td>
                  <td>{{ item.status }}</td>
                  <td>
                    <button @click="handleAction(index)" v-if="item.status === 'Pending'">Approve</button>
                    <button @click="handleAction(index)" v-else-if="item.status === 'Approved'">Cancel</button>
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
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import db from '../firebase/init.js';

export default {
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getDocs(collection(db, 'booking'))
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.items.push({ ...doc.data(), id: doc.id });
          });
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    async handleAction(index) {
      const selectedItem = this.items[index];
      const newStatus = selectedItem.status === 'Pending' ? 'Approved' : 'Cancelled';

      try {
        const bookingDocRef = doc(db, 'booking', selectedItem.id);
        await updateDoc(bookingDocRef, { status: newStatus });
        selectedItem.status = newStatus;
      } catch (error) {
        console.error('Error updating status:', error);
      }
    },
  },
};
</script>
