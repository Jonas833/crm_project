"use client";

import StaggeredMenu from '@/components/StaggeredMenu';


const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/Home/Dashboard' },
    { label: 'Bill', ariaLabel: 'Learn about us', link: '/Home/Bill' },
    { label: 'Customer', ariaLabel: 'View our services', link: '/Home/Customer' },
    { label: 'Settings', ariaLabel: 'Get in touch', link: '/Home/Settings' }
  ];
  
  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' }
  ];

export default function Page() {
    return (

    <div style={{ height: '100vh', background: '#1a1a1a' }}>
    <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#fff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={true}
        colors={['#B19EEF', '#5227FF']}
        logoUrl="/path-to-your-logo.svg"
        accentColor="#ff6b6b"
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
        isFixed={true} 
    />
    </div>

    )
}