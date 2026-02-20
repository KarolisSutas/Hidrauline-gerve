import { initCountUp } from './components/countUp';
import { initGallery } from './components/gallery';
import { initSlideShow } from './components/slideShow';
import { initDrawer } from './components/drawer';
import './main.css';
import 'flowbite';


document.addEventListener('DOMContentLoaded', () => {
    initCountUp();
    initGallery();
    initSlideShow();
    initDrawer();
});
