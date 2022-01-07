module.exports = {
  rewrites: () => [
    /* { source: '/api/redirect', destination: '/l' },
    { source: '/api/:rest*', destination: '/api-docs/:rest*' } */
    { source: '/l/:rest*', destination: '/api/redirect/:rest*' }
  ],
};
