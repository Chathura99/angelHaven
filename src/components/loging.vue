<!-- <template>
    <div class="login-container">

        <div class="login-box">
            <h1 id="logingtitle">Login</h1>
            <p class="text-black-50 mb-5">Please enter your login and password!</p>
            <div class="form-outline form-white mb-4">
                <input type="email" id="typeEmailX" class="form-control form-control-lg" placeholder="Enter Username"
                    v-model="email" />
            </div>
            <div class="form-outline form-white mb-4">
                <input type="password" id="typePasswordX" class="form-control form-control-lg" placeholder="Enter Password"
                    v-model="password" />
            </div>
            <div id="SignIn" v-if="!isSignedIn">
                <p><button @click="handleSignInWithEmail" class="sign-in goolesinin">Login</button></p>
            </div>
            <div>
                <p style="text-align: center;">_______________ or _______________</p>
            </div>

            <div id="GooleSignIn" v-if="!isSignedIn">
                <p><button @click="handleSignInGoogle" class="goolesinin">Google Sign in </button> </p>
            </div>
        </div>
    </div>
</template>
          
<script>
import firebaseConfig from '../firebaseConfig';
firebaseConfig
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import db from '../firebase/init.js';
import Swal from 'sweetalert2';

const provider = new GoogleAuthProvider();
const auth = getAuth();

export default {
    name: 'loging',
    data() {
        return {
            email: '',
            password: '',
            isSignedIn: false,
        }
    },
    methods:
    {
        async handleSignInGoogle() {
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                // Check if the user already exists in the Firestore collection
                const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
                const userSnapshot = await getDocs(userQuery);

                if (!userSnapshot.empty) {
                    // User already exists, no need to add to Firestore
                    console.log('User already exists in Firestore');
                } else {
                    // User does not exist, add to Firestore
                    const userDocRef = doc(db, 'users', user.uid);
                    await setDoc(userDocRef, {
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        firstName: user.displayName,
                        lastName: '',
                        position:""
                        // Add other details as needed
                    });

                    console.log('User added to Firestore');
                }

                this.isSignedIn = true;
                this.$router.push('/mealplain');
            } catch (error) {
                console.error('Error signing in with Google:', error.message);
                alert('Error signing in with Google. Please try again.\n',error.message);
            }
        },

        async handleSignInWithEmail() {
            try {
                const result = await signInWithEmailAndPassword(auth, this.email, this.password);
                const user = result.user;

                // Check if the user already exists in the Firestore collection
                const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
                const userSnapshot = await getDocs(userQuery);

                if (!userSnapshot.empty) {
                    const userData = userSnapshot.docs[0].data();
                    console.log("Login Success!")

                    // Check the user's role and route accordingly
                    if (userData.role === 'admin') {
                        this.isSignedIn = true;
                        this.$router.push('/adminhome');
                    } else if (userData.role === 'donor') {
                        this.isSignedIn = true;
                        this.$router.push('/mealplain');
                    } else {
                        this.isSignedIn = true;
                        this.$router.push('/Loging');
                    }

                    // this.isSignedIn = true;
                    // this.$router.push('/mealplain');
                }
            } catch (error) {
                console.log(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Error signing in. Please check your email and password.\n'
                });
            }
        },
        handleSignOut() {
            signOut(auth).then(() => {
                this.user = '';
                this.isSignedIn = false;
            }).catch((error) => {
                console.log(error);
            });
        }
    }
}

</script>

<style src="../assets/style/loging.css"></style>
<style src="../assets/scss/loging.scss"></style>

<style scoped>
@media (max-width:850px) {
    .login-container .login-box {
        width: 340px;
    }

}

p {
    text-align: center;
    margin-bottom: 2.5rem;
}

.login-container .login-box {
    margin-top: 129px;
    margin-bottom: 63px;
}

#logingtitle {
    font-size: 45.8px;
    font-weight: bold;
}
</style> -->




<template>
    <div class="login-container">
      <div class="login-box">
        <h1 id="logingtitle">Login</h1>
        <p class="text-black-50 mb-5">Please enter your login and password!</p>
  
        <div class="form-outline form-white mb-4">
          <input
            type="email"
            id="typeEmailX"
            class="form-control form-control-lg"
            placeholder="Enter Username"
            v-model="email"
            @input="validateEmail"
          />
          <span class="error-message">{{ emailError }}</span>
        </div>
  
        <div class="form-outline form-white mb-4">
          <input
            type="password"
            id="typePasswordX"
            class="form-control form-control-lg"
            placeholder="Enter Password"
            v-model="password"
            @input="validatePassword"
          />
          <span class="error-message">{{ passwordError }}</span>
        </div>
  
        <div id="SignIn" v-if="!isSignedIn">
          <p><button @click="handleSignInWithEmail" class="sign-in goolesinin">Login</button></p>
        </div>
  
        <div>
          <p style="text-align: center;">_______________ or _______________</p>
        </div>
  
        <div id="GooleSignIn" v-if="!isSignedIn">
          <p><button @click="handleSignInGoogle" class="goolesinin">Google Sign in </button></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import firebaseConfig from '../firebaseConfig';
  import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    signInWithEmailAndPassword,
  } from "firebase/auth";
  import { doc, setDoc, getDocs, query, collection, where } from "firebase/firestore";
  import db from '../firebase/init.js';
  import Swal from 'sweetalert2';
  
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  
  export default {
    name: 'loging',
    data() {
      return {
        email: '',
        password: '',
        isSignedIn: false,
        emailError: '',
        passwordError: '',
      }
    },
    methods: {
      async handleSignInGoogle() {
        try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                // Check if the user already exists in the Firestore collection
                const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
                const userSnapshot = await getDocs(userQuery);

                if (!userSnapshot.empty) {
                    // User already exists, no need to add to Firestore
                    console.log('User already exists in Firestore');
                } else {
                    // User does not exist, add to Firestore
                    const userDocRef = doc(db, 'users', user.uid);
                    await setDoc(userDocRef, {
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        firstName: user.displayName,
                        lastName: '',
                        position:""
                        // Add other details as needed
                    });

                    console.log('User added to Firestore');
                }

                this.isSignedIn = true;
                this.$router.push('/mealplain');
            } catch (error) {
                console.error('Error signing in with Google:', error.message);
                alert('Error signing in with Google. Please try again.\n',error.message);
            }
      },
  
      async handleSignInWithEmail() {
        try {
                const result = await signInWithEmailAndPassword(auth, this.email, this.password);
                const user = result.user;

                // Check if the user already exists in the Firestore collection
                const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
                const userSnapshot = await getDocs(userQuery);

                if (!userSnapshot.empty) {
                    const userData = userSnapshot.docs[0].data();
                    console.log("Login Success!")

                    // Check the user's role and route accordingly
                    if (userData.role === 'admin') {
                        this.isSignedIn = true;
                        this.$router.push('/adminhome');
                    } else if (userData.role === 'donor') {
                        this.isSignedIn = true;
                        this.$router.push('/mealplain');
                    } else {
                        this.isSignedIn = true;
                        this.$router.push('/Loging');
                    }

                    // this.isSignedIn = true;
                    // this.$router.push('/mealplain');
                }
            } catch (error) {
                console.log(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Error signing in. Please check your email and password.\n'
                });
            }
      },
  
      handleSignOut() {
        signOut(auth).then(() => {
                this.user = '';
                this.isSignedIn = false;
            }).catch((error) => {
                console.log(error);
            });
      },
  
      validateEmail() {
        if (!this.email) {
          this.emailError = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(this.email)) {
          this.emailError = 'Please enter a valid email address';
        } else {
          this.emailError = '';
        }
      },
  
      validatePassword() {
        if (!this.password) {
          this.passwordError = 'Password is required';
        } else if (this.password.length < 6) {
          this.passwordError = 'Password must be at least 6 characters';
        } else {
          this.passwordError = '';
        }
      },
    },
  };
  </script>
  
  <style src="../assets/style/loging.css"></style>
  <style src="../assets/scss/loging.scss"></style>
  
  <style scoped>
  @media (max-width:850px) {
      .login-container .login-box {
          width: 340px;
      }
  }
  
  p {
      text-align: center;
      margin-bottom: 2.5rem;
  }
  
  .login-container .login-box {
      margin-top: 129px;
      margin-bottom: 63px;
  }
  
  #logingtitle {
      font-size: 45.8px;
      font-weight: bold;
  }
  
  .error-message {
      color: red;
      font-size: 14px;
      margin-top: 5px;
  }
  </style>
  