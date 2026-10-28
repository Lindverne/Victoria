export function initSlider()

{
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".carousel-control.prev");
  const nextBtn = document.querySelector(".carousel-control.next");

  if (slides.length === 0) return;

  let currentIndex = 0;
  let slideInterval;


  function showSlide(index)
  {
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    slides[index].classList.add("active");

    if (dots[index]) dots[index].classList.add("active");

    currentIndex = index;
  }

  function nextSlide()
  {
    let next = (currentIndex + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide()
  {
    let prev = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  if (nextBtn)
  {
    nextBtn.onclick = () => {
      nextSlide();
      resetTimer();
    };

  }

  if (prevBtn)
  {
    prevBtn.onclick = () => {
      prevSlide();
      resetTimer();
    };

  }

  dots.forEach((dot, idx) => {
    dot.onclick = () => {
      showSlide(idx);
      resetTimer();
    };

  });

  function startTimer()
  {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function resetTimer()
  {
    clearInterval(slideInterval);
    startTimer();
  }

  showSlide(0);
  startTimer();
}
