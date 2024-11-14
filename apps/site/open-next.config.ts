const config = {
  default: {},

  middleware: {
    external: true,
    override: {
      wrapper: 'cloudflare',
      converter: 'edge',
    },
  },
};

export default config;
