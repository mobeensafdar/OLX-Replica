importScripts('https://www.gstatic.com/firebasejs/6.2.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.2.4/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '723723070846'
});

const messaging = firebase.messaging();

// Notification click
self.addEventListener('notificationclick', function(event) {
  var action_click = event.notification.data.click_action;
  event.notification.close();

  event.waitUntil(clients.openWindow(action_click));
});
  