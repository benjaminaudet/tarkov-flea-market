module.exports = {
  client: {
    service: {
      name: 'vitesse',
      // URL to the GraphQL API
      url: 'https://api.tarkov.dev/graphql',
    },
    // Files processed by the extension
    includes: [
      'src/**/*.vue',
      'src/**/*.js',
      'src/**/*.ts',
    ],
  },
}
