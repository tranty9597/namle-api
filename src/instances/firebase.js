import * as firebase from 'firebase';

const FirebaseIns = firebase.initializeApp({
    apiKey: 'AAAA3Oiu9Og:APA91bET4XPKZyTd8iJPIikmxD_NYWvd6tFNlf-FsGvCrUZjBuiaBzCK51A4M_RRBcGC6Xptb3kuFqr6yHWsrByjOiDkp7It7lDE2NGG_szCcXv2Z0UrNXgWijN9rIpGvvLwEWGpbkxz',
    databaseURL: 'https://namle-fb.firebaseio.com/',
    serviceAccount: './firebaseConfig.json'
});

const FirbaseDatabase = FirebaseIns.database()

export { FirebaseIns, FirbaseDatabase }