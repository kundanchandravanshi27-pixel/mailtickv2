importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDPVa0eYZpxYh6Q5vyhSf0IogTkedc72tE",
    authDomain: "mailtick-35818.firebaseapp.com",
    projectId: "mailtick-35818",
    storageBucket: "mailtick-35818.firebasestorage.app",
    messagingSenderId: "727149843542",
    appId: "1:727149843542:web:42037d523dea9c7f0797f7"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://www.svgrepo.com/show/475656/google-color.svg'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
