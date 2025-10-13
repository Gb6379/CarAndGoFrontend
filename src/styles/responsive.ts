// Responsive breakpoints
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};

// Media query helpers
export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (max-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: ${breakpoints.wide})`,
};

// Common responsive utilities
export const responsive = {
  container: `
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    
    ${media.desktop} {
      padding: 0 1.5rem;
    }
    
    ${media.tablet} {
      padding: 0 1rem;
    }
    
    ${media.mobile} {
      padding: 0 0.75rem;
    }
  `,
  
  grid: (columns: number) => `
    display: grid;
    grid-template-columns: repeat(${columns}, 1fr);
    gap: 1.5rem;
    
    ${media.desktop} {
      grid-template-columns: repeat(${Math.min(columns, 3)}, 1fr);
      gap: 1.25rem;
    }
    
    ${media.tablet} {
      grid-template-columns: repeat(${Math.min(columns, 2)}, 1fr);
      gap: 1rem;
    }
    
    ${media.mobile} {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  `,
  
  flexCenter: `
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  
  hideMobile: `
    ${media.mobile} {
      display: none;
    }
  `,
  
  hideDesktop: `
    ${media.desktop} {
      display: none;
    }
  `,
  
  textResponsive: (mobile: string, tablet: string, desktop: string) => `
    font-size: ${mobile};
    
    ${media.tablet} {
      font-size: ${tablet};
    }
    
    ${media.desktop} {
      font-size: ${desktop};
    }
  `,
};

export default responsive;
