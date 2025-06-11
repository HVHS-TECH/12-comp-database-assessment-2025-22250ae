const COL_C = 'white';	
const COL_B = '#CD7F32';

import { ref, set, getDatabase, get, update, query, orderByChild, limitToFirst} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
var response
var currentUser
var userId
var result
var fb_gamedb;
function fb_authenticate() {
    console.log('%c fb_initialise(): ', 
    'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    console.log("Hello world");

    const fb_gameconfig = {
        apiKey: "AIzaSyDHgtIZMIZCJPiRtsGfPR7U7MRHkROTFH4",
        authDomain: "comp2025-anthony-elliott.firebaseapp.com",
        databaseURL: "https://comp2025-anthony-elliott-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "comp2025-anthony-elliott",
        storageBucket: "comp2025-anthony-elliott.firebasestorage.app",
        messagingSenderId: "547175988310",
        appId: "1:547175988310:web:2d1b6a9924211d2d600ff7",
        measurementId: "G-KC1L63N0S9"
      };
    
    const fb_gameapp = initializeApp(fb_gameconfig);
    
    fb_gamedb  = getDatabase(fb_gameapp);
    console.info(fb_gamedb);
    const AUTH = getAuth();
    const PROVIDER = new GoogleAuthProvider();
    PROVIDER.setCustomParameters({
        prompt: 'select_account'
    });

    signInWithPopup(AUTH, PROVIDER).then((result) => {
        currentUser = result.user;
        userId = currentUser.uid;
        console.log("Authentication succesful");
        console.log(result);
        console.log(result.user.uid)
    })

    .catch((error) => {
        console.log("Authentication unsuccesful");
        console.log(error);
        const AUTH = getAuth();
    
        }, (error) => {
    
            console.log("error");
    
        });
      };
function fb_write() {
    if (!currentUser) {
        alert("Log in to fill out form");
        return;
    }
    var name = document.getElementById("name").value;
    var age = document.getElementById("age").value;
    var childhoodpetsname = document.getElementById("childhoodpetsname").value;
    var mothersmaidenname = document.getElementById("mothersmaidenname").value;
    var modelofyourfirstcar = document.getElementById("modelofyourfirstcar").value;
    var whatcitywereyoubornin = document.getElementById("whatcitywereyoubornin").value;
    var whatstreetdidyougrowupon = document.getElementById("whatstreetdidyougrowupon").value;

    var dbReference = ref(fb_gamedb, 'users/' + userId);
     set(dbReference, {
        Name: name,
        Age: age,
        Childhoodpetsname: childhoodpetsname,
        Mothersmaidenname: mothersmaidenname,
        Modelofyourfirstcar: modelofyourfirstcar,
        Whatcitywereyoubornin: whatcitywereyoubornin,
        Whatstreetdidyougrowupon: whatstreetdidyougrowupon

    }).then(() => {
        console.log("succesful write")
        window.location.assign("gamechoose.html");
    }).catch((error) => {
        console.log("unsuccesful write")
        console.log(error);
    });
} 
    export { 
    fb_authenticate, fb_write
 };