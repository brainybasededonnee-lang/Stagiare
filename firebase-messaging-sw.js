// firebase-messaging-sw.js

// 1. Importation des scripts Firebase (Version Compat pour le Service Worker)
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// 2. Initialisation avec votre configuration Firebase exacte
const firebaseConfig = {
    apiKey: "AIzaSyBRk9DTRauiYzF49pNly34vWPEChIBkMIo",
    authDomain: "stagiaire-afc7b.firebaseapp.com",
    projectId: "stagiaire-afc7b",
    storageBucket: "stagiaire-afc7b.firebasestorage.app",
    messagingSenderId: "211607769009",
    appId: "1:211607769009:web:7676af127f0ae6927e3790"
};

// Initialiser l'application Firebase dans le Service Worker
firebase.initializeApp(firebaseConfig);

// Initialiser Firebase Cloud Messaging
const messaging = firebase.messaging();

// 3. Gestion des messages reçus en arrière-plan (quand l'onglet est fermé)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan', payload);

    // Personnalisation de la notification push
    const notificationTitle = payload.notification?.title || 'Nouveau message sur Brainy Hub';
    const notificationOptions = {
        body: payload.notification?.body || 'Vous avez reçu un nouveau message.',
        icon: '/icon.png', // Remplacez par le chemin vers le logo Brainy Agency
        badge: '/badge.png', // Petite icône monochrome (optionnelle)
        vibrate: [200, 100, 200],
        data: payload.data || {} // Permet de passer des données personnalisées (comme le chatId)
    };

    // Affichage natif de la notification par le navigateur
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 4. Gestion du clic sur la notification
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Clic sur la notification intercepté.');
    event.notification.close();

    // Rediriger l'utilisateur vers l'application si elle n'est pas déjà ouverte
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Vérifie si un onglet est déjà ouvert avec l'application
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes('/') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Si aucun onglet n'est ouvert, on ouvre une nouvelle fenêtre
            if (clients.openWindow) {
                return clients.openWindow('/'); // URL racine de votre chat
            }
        })
    );
});