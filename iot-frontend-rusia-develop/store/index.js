export const state = () => ({
  title: 'IOT',
  logo: '@/assets/svg/logo.svg',
  items: [
    {
      icon: 'bx bxs-dashboard',
      title: 'Dasboard',
      subtitle: '',
      to: '/',
    },
    {
      icon: 'bx bx-building-house',
      title: 'Locations',
      subtitle: '',
      to: '/locations',
    },
    {
      icon: 'bx bx-building-house',
      title: 'Greenhouses',
      subtitle: '',
      to: '/greenhouses',
    },
    {
      icon: 'bx bx-microchip',
      title: 'Sensors Models',
      subtitle: '',
      to: '/sensors',
    },
    {
      icon: 'bx bx-chip',
      title: 'Devices',
      subtitle: '',
      to: '/devices',
    },
    {
      icon: 'bx bx-time',
      title: 'Real Time',
      subtitle: '',
      to: '/real-time',
    },
    {
      icon: 'bx bx-bell',
      title: 'Alarms',
      subtitle: '',
      to: '/alarms',
    },
    {
      icon: 'bx bx-columns',
      subtitle: '',
      title: 'Templates',
      to: '/templates',
    },

    {
      icon: 'bx bx-bar-chart',
      subtitle: '',
      title: 'Indicators',
      to: '/indicators',
    },
  ],
})
