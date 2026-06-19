/* Bharucha & Co. — shared Tailwind theme tokens (load right after the Tailwind CDN) */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy: '#1E196B',
        navydeep: '#15103F',
        indigo2: '#4F46E5',
        slate2: '#64748B',
        ink: '#0F172A',
        offwhite: '#F8FAFC',
      },
      fontFamily: {
        display: ['Rubik', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    }
  }
}
