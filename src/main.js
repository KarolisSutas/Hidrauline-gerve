import './main.css';
import 'flowbite';

import { initCountUp } from './components/countUp';
import { initGallery } from './components/gallery';
import { initSlideShow } from './components/slideShow';
import { initDrawer } from './components/drawer';
import { initNavDropdown } from './components/navDropdown';
import { initForm } from './components/form';
import { initCardScrollAnimation } from './components/cardScrollAnimation';


document.addEventListener('DOMContentLoaded', () => {
    initCountUp();
    initGallery();
    initSlideShow();
    initDrawer();
    initNavDropdown();
    initForm('contact-form', 'form-success');
    initForm('contact-page-form', 'page-form-success');
    initCardScrollAnimation();
});
