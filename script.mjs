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
function fb_initialise() {
    console.log('%c fb_initialise(): ', 
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    console.log("Hello world");
    const FB_GAMECONFIG = {
        apiKey: "AIzaSyDHgtIZMIZCJPiRtsGfPR7U7MRHkROTFH4",
        authDomain: "comp2025-anthony-elliott.firebaseapp.com",
        databaseURL: "https://comp2025-anthony-elliott-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "comp2025-anthony-elliott",
        storageBucket: "comp2025-anthony-elliott.firebasestorage.app",
        messagingSenderId: "547175988310",
        appId: "1:547175988310:web:2d1b6a9924211d2d600ff7",
        measurementId: "G-KC1L63N0S9"
      };
    const FB_GAMEAPP = initializeApp(FB_GAMECONFIG);
    fb_gamedb  = getDatabase(FB_GAMEAPP);
    console.info(fb_gamedb);
}
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
        console.log(result.user.uid.highscore)
    })

    .catch((error) => {
        console.log("Authentication unsuccesful");
        console.log(error);
    
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
    }).catch((error) => {
        console.log("unsuccesful write")
        console.log(error);
    });
} 
function fb_authchange(){
    const AUTH = getAuth();
    onAuthStateChanged(AUTH, (user) => {
        if (user) {
            console.log("user logged in")
        } else {
            console.log("user logged out")
        }
    }, (error) => {
        console.log("unsuccesful log in")
    });
}
function fb_read(){
    const dbReference = ref(FB_GAMEDB, "users/ + userId + highscore");
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log("succesful read")
            console.log(fb_data)
        } else {
            console.log("no record found")
        }
    }).catch((error) => {
        console.log("error with reading")
        console.log(error)
    });
}

function fb_game() {
    window.location.assign("https://musical-robot-v6rjxvxx76v7c6xw6-5503.app.github.dev/game1.html");
}
    export { 
    fb_authenticate, fb_write, fb_game, fb_initialise, fb_read
 };