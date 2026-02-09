import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);


export function initHeroScroll() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const gerve = document.querySelector('.hero-container .gerve-animation');
    const tableSection = document.querySelector('.gerve-table');
    const tableRows = document.querySelectorAll('.gerve-table tbody tr');

    if (!gerve || !tableSection) return;

    // 1. ANIMACIJA: Gervės kelionė (priklauso nuo viršutinės sekcijos)
    gsap.to(gerve, {
        scrollTrigger: {
            trigger: ".lengvoji-serija-section",
            start: "top 0%",
            end: "bottom top",
            scrub: 1.5,
            // once: true, // Animacija suveiks tik vieną kartą judant žemyn
            // onLeave: (self) => {
            //     // Kai animacija pasibaigia (nuvažiuojame žemyn):
            //     // Galime arba palikti gervę ten, kur ji buvo, arba ją "nunulinti"
            //     gsap.set(gerve, { clearProps: "all" }); // Išvalo visus GSAP stilius (grįžta į CSS pradinę būseną)
            //     self.kill(); // Sunaikina patį trigerį, kad jis nebereaguotų skrolinant atgal
            // }
        },
        motionPath: {
            path: [{ x: 0, y: 0 }, { x: 0, y: 150 }, { x: 0, y: 350 }, { x: 0, y: 580 }],
            curviness: 1.5
        },
        scale: 1.2,
        opacity: 1
    });

    // 2. ANIMACIJA: Lentelės atsiradimas (nepriklausoma, reaguoja į savo poziciją)
    const tableTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".gerve-table", // Animacija prasidės, kai ši sekcija įvažiuos į ekraną
            start: "top 80%",      // Prasideda, kai lentelės viršus kerta 80% ekrano aukščio
            toggleActions: "play none none reverse", // Atsiranda skrolinant žemyn, dingsta skrolinant aukštyn
            // scrub: 1            // Galite palikti scrub, jei norite valdyti eilučių atsiradimą pelės ratuku
        }
    });

    tableTl.to(tableSection, {
        autoAlpha: 1,
        duration: 0.5
    })
    .to(tableRows, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
    });
}