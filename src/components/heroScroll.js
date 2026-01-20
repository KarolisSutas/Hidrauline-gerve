import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);


export function initHeroScroll() {
    // išvalys senus trigerius ir nesidubliuos animacijos
    ScrollTrigger.getAll().forEach(t => t.kill());

    const gerve = document.querySelector('.gerve-animation');
    const container = document.querySelector('.hero-container');

    if (!gerve || !container) return;

    // Sukuriame laiko juostą, susietą su skrolinimu
    const timeLine = gsap.timeline({
        scrollTrigger: {
            trigger: ".lengvoji-serija-section", // Sekcija, kurioje prasideda veiksmas
            start: "top 0%",     // Animacija prasideda, kai sekcija netoli viršaus
            end: "bottom top",    // Baigiasi, kai sekcija nuvažiuoja į viršų
            scrub: 1.5,           // Švelnus vėlavimas (smoothness)
            markers: true        // Pasikeisk į true, jei nori matyti pradžios/pabaigos linijas
        }
    });

    // Pagrindinė gervės kelionė
    timeLine.to(gerve, {
        motionPath: {
            path: [
                { x: 0, y: 0 },          // Pradinė pozicija
                { x: 0, y: 150 },     // Pirma kreivė (į kairę ir žemyn)
                { x: 0, y: 350 },      // Antra kreivė (grįžta šiek tiek į dešinę)
                { x: 0, y: 500 }      // Leidžiasi dar žemiau
            ],
            curviness: 1.5,            // Suapvalina kampus tarp taškų
            autoRotate: false          // Paveikslėlis nesivartys pagal kelią
        },
        scale: 1.2,                    // Skrolinant gervė šiek tiek padidėja
        opacity: 0,                  // Šiek tiek praranda ryškumą pabaigoje
        duration: 3
    });

    // // Papildoma animacija tekstui, kol gervė juda
    // timeLine.to(".dark-gray h1", {
    //     x: -50,
    //     opacity: 0,
    //     duration: 1
    // }, 0); // "0" reiškia, kad prasideda kartu su gervės judesiu

    // timeLine.to('.light-gray-bottom p' , {
    //     x: -50,
    //     opacity: 0,
    //     duration: 1
    // }, 0);
}
