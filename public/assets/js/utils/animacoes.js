export function initAnimations()

{

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const globalObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {

      if (entry.isIntersecting)
      {
        entry.target.classList.add("active");

        observer.unobserve(entry.target);
      }

    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll(
    ".reveal, .fade-in, .slide-up, .zoom-in",
  );

  if (elementsToAnimate.length > 0)
  {
    elementsToAnimate.forEach((el) => globalObserver.observe(el));
  }

}
