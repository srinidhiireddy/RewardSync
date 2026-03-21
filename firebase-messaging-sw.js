/* ============================================
   REWARDSYNC — Firebase Messaging Service Worker
   ============================================ */

importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCxT4IEOw5tmGINCHBaG0K0-UapeaYrKFI",
  authDomain: "rewardsync-7e513.firebaseapp.com",
  projectId: "rewardsync-7e513",
  storageBucket: "rewardsync-7e513.firebasestorage.app",
  messagingSenderId: "1017582581404",
  appId: "1:1017582581404:web:a06b8649c44498e6941f59",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
