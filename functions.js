const { exec } = require('child_process')
var fs = require('fs')
var fetch = require('node-fetch')
var admin = require("firebase-admin");

exports.new = (id) => {
  return new Promise((resolve, reject) => {
    var dir =`${__dirname}/${id}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        postLog(`New user ${id} root folder created \n`)
        resolve('Folder created')
    }else{
      reject('Folder exists')
    }
  })
}

exports.getData = (db, id, token) => {
  return new Promise(function(resolve, reject) {
    var ref = db.ref(body.id)
    try{
      ref.on("value", function(snapshot) {
        const data = snapshot.val()
        if(data.token == token){
          resolve({
            auth:true,
            data:data
          })
        }else{
          resolve({
            auth:false,
            data:null
          })
        }

      })
    }
    catch(err){
      reject(err)
    }
  });

}

exports.clone = (url, id) => {
  return new Promise((resolve, reject) => {
    const git = exec(`git clone ${url}`, function (error, stdout, stderr) {
      if (error) {
          reject(errr)
      }
    })
    git.on('exit', function (code) {
      postLog(`User ${id} cloned ${url} \n`)
      resolve('Cloned')
    })
  })
}

exports.install = (dir, id, name) => {
  return new Promise((resolve, reject) => {
    const install = exec('npm i', function (error, stdout, stderr) {
      if (error) {
          reject(error)
      }
    })
    install.on('exit', function (code) {
      postLog(`User ${id} installed dependencies for ${name} \n`)
      resolve('Installed')
    })
  })
}

exports.build = (name, id) => {
  return new Promise((resolve, reject) => {
    const build = exec('npm run build', function (error, stdout, stderr) {
      if (error) {
          reject(error)
      }
    })
    build.on('exit', function (code) {
      postLog(`Build complete for ${name} by user ${id}\n`)
      resolve('Packaging complete')
    })
  })
}

const randomString = () => {
  var text = "";
  var char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i=0; i < 7; i++ )  {
    text += char_list.charAt(Math.floor(Math.random() * char_list.length));
  }
  return text;
}


const postLog = (msg) => {
  let db = admin.firestore();
  const rand = randomString()
  let date = Date.now()
  let data = {
    date:date,
    msg:msg
  }
  let setDoc = db.collection('logs').doc(date.toString()).set(data);
}
