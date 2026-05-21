/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0f1f30',
        tide: '#184e67',
        mist: '#d8e7f1',
        shell: '#f4f8fb',
        ember: '#9f5130',
        pine: '#0d7a63',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 24px 80px rgba(15, 31, 48, 0.18)',
      },
      backgroundImage: {
        'hero-mesh':
          'radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 28%), radial-gradient(circle at 80% 18%, rgba(13, 122, 99, 0.18), transparent 20%), linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.55))',
      },
    },
  },
  plugins: [],
};
