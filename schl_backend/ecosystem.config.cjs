module.exports = {
  apps: [
    {
      name: "schl_backend",
      script: "./server.js",
      instances: 1,
      env: {
        NODE_ENV: "development",
        JWT_SECRET: "QWERTYUIOPASDFGHJKLZXCVBNM"
      },
      env_production: {
        NODE_ENV: "production",
        JWT_SECRET: "QWERTYUIOPASDFGHJKLZXCVBNM"
      }
    }
  ]
};

