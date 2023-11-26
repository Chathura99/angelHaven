<template>
  <div class="container">
    <div class="section-title">
      <h3 class="faqsection" style="font-size: 45.8px; font-weight: bold; margin-top: 40px;">My Booking Details</h3>
    </div>

    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body">
            <table class="table table-striped table-mobile-responsive table-mobile-sided">
              <thead>
                <tr>
                  <th scope="col">Meal</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.meal }}</td>
                  <td>{{ item.dateInput }}</td>
                  <td>
                    <button id="BuyButton"
                      class="bg-blue-500 hover:bg-blue-600 absolute top-0 left-1/2 transform -translate-x-1/2 mt-2 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <b>{{item.status}}</b>
                    </button>
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
import { collection, getDocs, where, query } from 'firebase/firestore';
import db from '../firebase/init.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userId = user.uid;

          // Create a query to fetch bookings for the current user
          const q = query(
            collection(db, 'booking'),
            where('uid', '==', userId)
          );

          try {
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
              this.items.push(doc.data());
              console.log(doc.data());
            });
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
      });
    },
  },
};
</script>