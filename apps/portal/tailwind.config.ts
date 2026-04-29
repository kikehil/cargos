import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        oxxo: {
          red: '#E2001A',
          yellow: '#FFD700',
        },
      },
    },
  },
  plugins: [],
}

export default config
