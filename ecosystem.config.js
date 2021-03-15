module.exports = {
  apps : [{
    script: 'server.js',
    watch: '.js'
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'YadneshKhode',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'https://github.com/YadneshKhode/Chat-Application-Backend.git',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      // 'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
