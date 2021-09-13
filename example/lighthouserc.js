module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:9000/'],
      startServerCommand: 'npm run serve',
      startServerReadyPattern: 'You can now view',
    },
    assert: {
      preset: 'lighthouse:recommended',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
