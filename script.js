const sections = document.querySelectorAll("section");

const DURATION = 1000; // ms

let currentSection = 0;
let isScrolling = false;


/*
 * Ease-in-out függvény.
 *
 * 0 → 0
 * 0.5 → 0.5
 * 1 → 1
 *
 * Az elején lassan indul,
 * középen felgyorsul,
 * a végén pedig ismét lelassul.
 */
function easeInOut(t) {
    return t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;
}


/*
 * Az aktuális scroll pozícióból
 * animálunk a célpozícióig.
 */
function scrollToSection(index) {

    if (index < 0 || index >= sections.length) {
        return;
    }

    if (isScrolling) {
        return;
    }

    isScrolling = true;

    const startPosition = window.scrollY;

    const targetPosition = sections[index].offsetTop;

    const distance = targetPosition - startPosition;

    const startTime = performance.now();


    function animate(currentTime) {

        const elapsed = currentTime - startTime;

        /*
         * 0 és 1 közötti érték.
         *
         * 0 = animáció kezdete
         * 1 = animáció vége
         */
        const progress = Math.min(
            elapsed / DURATION,
            1
        );


        /*
         * Ease-in-out alkalmazása.
         */
        const easedProgress = easeInOut(progress);


        /*
         * Új scroll pozíció kiszámítása.
         */
        const currentPosition =
            startPosition +
            distance * easedProgress;


        window.scrollTo(
            0,
            currentPosition
        );


        /*
         * Ha még nem értünk a végére,
         * folytatjuk az animációt.
         */
        if (progress < 1) {

            requestAnimationFrame(animate);

        } else {

            /*
             * Biztosan pontosan a section tetején
             * állunk meg.
             */
            window.scrollTo(
                0,
                targetPosition
            );

            currentSection = index;

            isScrolling = false;
        }
    }


    requestAnimationFrame(animate);
}


/*
 * EGÉRKERÉK
 *
 * A natív scroll teljesen le van tiltva.
 */
window.addEventListener(
    "wheel",
    function (event) {

        event.preventDefault();


        /*
         * Ha éppen animáció zajlik,
         * figyelmen kívül hagyjuk
         * az újabb wheel eseményt.
         */
        if (isScrolling) {
            return;
        }


        /*
         * deltaY:
         *
         * pozitív → lefelé
         * negatív → felfelé
         */
        if (event.deltaY > 0) {

            currentSection++;

        } else if (event.deltaY < 0) {

            currentSection--;
        }


        /*
         * Ne menjünk a legfelső section fölé
         * vagy a legalsó alá.
         */
        currentSection = Math.max(
            0,
            Math.min(
                currentSection,
                sections.length - 1
            )
        );


        scrollToSection(currentSection);

    },
    {
        passive: false
    }
);