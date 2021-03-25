module.exports = {
  apps : [{
    name: "backend",
    script: "pm2 start server.js",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}