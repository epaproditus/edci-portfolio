module.exports = {
  apps: [
    {
      name: 'edci-portfolio',
      script: 'python3',
      args: '-m http.server 9009',
      cwd: '/home/abe/Life OS/Projects/edci-portfolio',
      interpreter: 'none',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
