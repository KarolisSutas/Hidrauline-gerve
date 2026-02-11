

export function initSlideShow() {
    let slideIndex = 1;
    let slideTimer;
    let isPaused = false; // stebim, ar sustabdyta

    const container = document.querySelector(".slideshow-container");

    showSlides(slideIndex);

    function plusSlides(n) {
        showSlides(slideIndex += n, true); // true – reiškia rankinis keitimas
    }

    function currentSlide(n) {
        showSlides(slideIndex = n, true);
    }

    // PADAROM GLOBALIAI, kad onclick jas rastų
    window.plusSlides = plusSlides;
    window.currentSlide = currentSlide;

    showSlides(slideIndex);

    function showSlides(n) {
        const slides = document.getElementsByClassName("mySlides");
        const dots = document.getElementsByClassName("dot");

        if (n > slides.length) slideIndex = 1;
        if (n < 1) slideIndex = slides.length;

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }

        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";

        // sustabdom seną laikmatį
        clearTimeout(slideTimer);

        // jei rankinis keitimas, iš naujo startuojam laikmatį
        if (!isPaused) {
            slideTimer = setTimeout(() => showSlides(slideIndex += 1), 3000);
        }
    }

    // sustabdyti automatinį slinkimą
    function stopSlides() {
        isPaused = true;
        clearTimeout(slideTimer);
    }

    // tęsti automatinį slinkimą
    function startSlides() {
        isPaused = false;
        clearTimeout(slideTimer);
        slideTimer = setTimeout(() => showSlides(slideIndex += 1), 7000);
    }

    // užvedus pelę – sustoja
    container.addEventListener("mouseenter", stopSlides);
    // nuėmus pelę – tęsia
    container.addEventListener("mouseleave", startSlides);

    console.log(isPaused);
}