import './src/styles/global.scss'; // my global css
import 'bootstrap/dist/css/bootstrap.min.css';

import '@fortawesome/fontawesome-svg-core/styles.css';

import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init({
    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    once: true // whether animation should happen only once - while scrolling down
});
