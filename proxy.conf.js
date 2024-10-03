var defaultTarget = "https://dev.elevate-apis.shikshalokam.org";
module.exports = [
  {
    context: ['/user'],
    target: defaultTarget,
    changeOrigin: true,
  },
  {
    context: ['/scp/v1'],
    target: defaultTarget,
    changeOrigin: true,
  }
];
