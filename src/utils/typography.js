import Typography from 'typography';
import fairyGatesTheme from 'typography-theme-fairy-gates';

// Settings: http://kyleamathews.github.io/typography.js
const typography = new Typography(fairyGatesTheme);

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
    typography.injectStyles();
}

// Export helper functions
export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
