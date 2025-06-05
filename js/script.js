document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.main__autos-tab-btn');
  const slidesContainer = document.querySelector('.main__autos-slides');
  const wrapper = document.querySelector('.main__autos-tab-content-wrapper');
  const arrowLeft = document.querySelector('.main__autos-arrow--left');
  const arrowRight = document.querySelector('.main__autos-arrow--right');
  const dots = document.querySelectorAll('.main__autos-dot');

  const tabsArray = Array.from(tabButtons);
  const totalTabs = tabsArray.length;
  let currentIndex = 0;

  let touchStartX = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 50;

  function updateActiveDot(index) {
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) {
      dots[index].classList.add('active');
    }
  }

  function updateSlider(newIndex) {
    tabButtons.forEach(btn => btn.classList.remove('main__autos-tab-btn--active'));
    if (tabsArray[newIndex]) {
      tabsArray[newIndex].classList.add('main__autos-tab-btn--active');
    }
    const wrapperWidth = wrapper.clientWidth;
    const shiftX = newIndex * wrapperWidth;
    slidesContainer.style.transform = `translateX(-${shiftX}px)`;

    updateActiveDot(newIndex);

    currentIndex = newIndex;
  }

  tabButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      updateSlider(idx);
    });
  });

  arrowLeft.addEventListener('click', () => {
    const prevIndex = (currentIndex <= 0) ? totalTabs - 1 : currentIndex - 1;
    updateSlider(prevIndex);
  });

  arrowRight.addEventListener('click', () => {
    const nextIndex = (currentIndex >= totalTabs - 1) ? 0 : currentIndex + 1;
    updateSlider(nextIndex);
  });

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateSlider(idx);
    });
  });

  wrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  wrapper.addEventListener('touchmove', (e) => {
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX < -SWIPE_THRESHOLD) {
      const prevIndex = (currentIndex <= 0) ? totalTabs - 1 : currentIndex - 1;
      updateSlider(prevIndex);
    }
    else if (diffX > SWIPE_THRESHOLD) {
      const nextIndex = (currentIndex >= totalTabs - 1) ? 0 : currentIndex + 1;
      updateSlider(nextIndex);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    const wrapperWidth = wrapper.clientWidth;
    slidesContainer.style.transform = `translateX(-${currentIndex * wrapperWidth}px)`;
  });

  slidesContainer.style.transform = 'translateX(0px)';
  updateActiveDot(0);
});
