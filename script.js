const sections = document.querySelectorAll(".page-section");

const DURATION = 1000;

let currentSection = 0;
let isScrolling = false;


function easeInOut(t) {

    return t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;

}


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

        const progress = Math.min(
            elapsed / DURATION,
            1
        );

        const easedProgress = easeInOut(progress);

        const currentPosition =
            startPosition +
            distance * easedProgress;


        window.scrollTo(
            0,
            currentPosition
        );


        if (progress < 1) {

            requestAnimationFrame(animate);

        } else {

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


/* =========================
   MOUSE WHEEL
   ========================= */

window.addEventListener(
    "wheel",
    function (event) {

        event.preventDefault();


        if (isScrolling) {
            return;
        }


        if (event.deltaY > 0) {

            currentSection++;

        } else if (event.deltaY < 0) {

            currentSection--;

        }


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


/* =========================
   ANCHOR LINKS
   ========================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const target =
                    document.querySelector(
                        this.getAttribute("href")
                    );


                if (!target) {
                    return;
                }


                const index =
                    Array.from(sections)
                        .indexOf(target);


                if (index === -1) {
                    return;
                }


                currentSection = index;

                scrollToSection(index);

            }
        );

    });