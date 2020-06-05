const { exec } = require('child_process');
var fs = require('fs');

exports.new = (id) => {
  return new Promise((resolve, reject) => {
    var dir =`${__dirname}/${id}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
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

exports.clone = (url) => {
  return new Promise((resolve, reject) => {
    const git = exec(`git clone ${url}`, function (error, stdout, stderr) {
      if (error) {
          reject(errr)
      }
    })
    git.on('exit', function (code) {
      resolve('Cloned')
    })
  })
}

exports.install = (dir) => {
  return new Promise((resolve, reject) => {
    const install = exec('npm i', function (error, stdout, stderr) {
      if (error) {
          reject(error)
      }
    })
    install.on('exit', function (code) {
      resolve('Installed')
    })
  })
}

exports.build = () => {
  return new Promise((resolve, reject) => {
    const build = exec('npm run build', function (error, stdout, stderr) {
      if (error) {
          reject(error)
      }
    })
    build.on('exit', function (code) {
      resolve('Packaging complete')
    })
  })
}
