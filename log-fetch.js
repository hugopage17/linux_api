var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert('./key.json'),
  databaseURL: "https://cloud-ba7c0.firebaseio.com"
})
var db = admin.firestore()

let logs = db.collection('logs');
logs.get().then(snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data()
      console.log(data.msg);
    });
}).catch(err => {
  console.log('Error getting documents', err);
});
