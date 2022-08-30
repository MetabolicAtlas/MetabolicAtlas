module.exports = {
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['./test/jest.setup.js'],
  slowTestThreshold: 40,
  testTimeout: 60000,
};
