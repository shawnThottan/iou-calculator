module.exports = {
  apps : [{
    name   : "IoU-server",
    script : "./dist/app.js",
    exec_mode : "cluster",
    instances : "1",
  }]
}
