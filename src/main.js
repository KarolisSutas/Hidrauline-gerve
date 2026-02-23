import './main.css';
import 'flowbite';

import { initCountUp } from './components/countUp';
import { initGallery } from './components/gallery';
import { initSlideShow } from './components/slideShow';
import { initDrawer } from './components/drawer';
import { initNavDropdown } from './components/navDropdown';


document.addEventListener('DOMContentLoaded', () => {
    initCountUp();
    initGallery();
    initSlideShow();
    initDrawer();
    initNavDropdown();
});
