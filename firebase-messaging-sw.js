// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDPVa0eYZpxYh6Q5vyhSf0IogTkedc72tE",
    projectId: "mailtick-35818",
    messagingSenderId: "727149843542",
    appId: "1:727149843542:web:42037d523dea9c7f0797f7"
});

const messaging = firebase.messaging();