<template>
    <div class="login-container">
        <div class="login-box">
            <div class="login-header">
                <h1 id="logingtitle">Register</h1>
                <p class="text-black-50 mb-5">Please Register Here...</p>
                <div class="form-outline form-white mb-4">
                    <input type="text" id="typeFirstNameX" class="form-control form-control-lg"
                        placeholder="Enter First Name" v-model="firstName" @input="validateFirstName" />
                    <span class="error-message">{{ firstNameError }}</span>
                </div>
                <div class="form-outline form-white mb-4">
                    <input type="text" id="typeLastNameX" class="form-control form-control-lg" placeholder="Enter Last Name"
                        v-model="lastName" @input="validateLastName" />
                    <span class="error-message">{{ lastNameError }}</span>
                </div>
                <div class="form-outline form-white mb-4">
                    <input type="email" id="typeEmailX" class="form-control form-control-lg" placeholder="Enter email"
                        v-model="email" @input="validateEmail" />
                    <span class="error-message">{{ emailError }}</span>
                </div>
                <div class="form-outline form-white mb-4">
                    <input type="password" id="typePasswordX" class="form-control form-control-lg"
                        placeholder="Enter Password" v-model="password" @input="validatePassword" />
                    <span class="error-message">{{ passwordError }}</span>
                </div>
            </div>

            <div class="login-body">
                <form action=""></form>
            </div>

            <div id="SignIn" v-if="!isSignedIn">
                <p><button @click="handleSignUp" class="sign-in goolesinin">Register</button></p>
            </div>

            <div id="GooleSignIn" v-if="!isSignedIn">
                <p><button @click="handleSignInGoogle" class="goolesinin">Google Sign in </button> </p>
            </div>
        </div>
    </div>
</template>
  
<script>
import firebaseConfig from '../firebaseConfig';
import {
    getAuth,
    signInWithPopup,
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc, query, collection, where } from "firebase/firestore";
import db from '../firebase/init.js';
import Swal from 'sweetalert2';

firebaseConfig

const provider = new GoogleAuthProvider();
const auth = getAuth();

export default {
    name: 'register',
    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            isSignedIn: false,
            firstNameError: '',
            lastNameError: '',
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
                        lastName: user.displayName,
                        role: "donor",
                        position: ""
                        // Add other details as needed
                    });

                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Registered successfully!'
                    });
                }

                this.isSignedIn = true;
                this.$router.push('/mealplain');
            } catch (error) {
                console.error('Error signing in with Google:', error.message);
                alert('Error signing in with Google. Please try again.');
            }
        },

        async handleSignUp() {
            try {
                // Validate input fields
                if (this.validateForm()) {
                    // Create user with email and password
                    const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
                    const user = userCredential.user;

                    // Update the user's profile (you can include additional details like displayName)
                    await updateProfile(user, {
                        displayName: `${this.firstName} ${this.lastName}`,
                    });

                    // Add user details to Firestore
                    const userDocRef = doc(db, 'users', user.uid);
                    await setDoc(userDocRef, {
                        firstName: this.firstName,
                        lastName: this.lastName,
                        email: this.email,
                        uid: user.uid,
                        role: "donor",
                        position: ""
                    });

                    this.isSignedIn = true;
                    // Redirect to the appropriate route
                    this.$router.push('/Loging');
                }
            } catch (error) {
                console.error('Error signing up:', error.message);

                Swal.fire({
                    icon: 'error',
                    title: 'Failed!',
                    text: 'Error signing up. Please try again.'
                });
            }
        },

        validateForm() {
            if (!this.firstName) {
                this.firstNameError = 'First Name is required';
                return false;
            } else if (/^\d+$/.test(this.firstName)) {
                this.firstNameError = 'First Name cannot be a number';
                return false;
            } else {
                this.firstNameError = '';
            }

            if (!this.lastName) {
                this.lastNameError = 'Last Name is required';
                return false;
            } else if (/^\d+$/.test(this.lastName)) {
                this.lastNameError = 'Last Name cannot be a number';
                return false;
            } else {
                this.lastNameError = '';
            }

            if (!this.email || !/\S+@\S+\.\S+/.test(this.email)) {
                this.emailError = 'Enter a valid email address';
                return false;
            } else {
                this.emailError = '';
            }

            if (!this.password || this.password.length < 6) {
                this.passwordError = 'Password must be at least 6 characters';
                return false;
            } else {
                this.passwordError = '';
            }

            return true;
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

.error-message {
        color: red;
        font-size: 14px;
        margin-top: 5px;
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
</style>