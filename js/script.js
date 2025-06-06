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


document.addEventListener('DOMContentLoaded', () => {
  const slidesContainer = document.querySelector('.main__reviews-slides');
  const wrapper = document.querySelector('.main__reviews-wrapper');
  const reviews = document.querySelectorAll('.main__reviews-review');
  const paginationContainer = document.querySelector('.main__reviews-pagination');

  let currentPage = 0;      // текущая «страница» (0-based)
  let slidesToShow = 3;     // сколько карточек показываем сразу
  let totalPages = 1;       // количество «страниц»

  // Для свайпа на мобильных:
  let touchStartX = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 50;

  // === 1) Рассчитываем, сколько карточек показывать в зависимости от ширины окна ===
  function calculateLayout() {
    const width = window.innerWidth;
    if (width < 768) {
      slidesToShow = 1;
    } else if (width <= 1200) {
      slidesToShow = 2;
    } else {
      slidesToShow = 3;
    }
    totalPages = Math.ceil(reviews.length / slidesToShow);
  }

  // === 2) Строим точки пагинации (если страниц > 1) ===
  function buildPagination() {
    paginationContainer.innerHTML = ''; // очищаем старые точки
    if (totalPages <= 1) return;        // если всего 1 страница — не показываем точки

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('span');
      dot.classList.add('main__reviews-dot');
      if (i === currentPage) dot.classList.add('active');
      dot.dataset.index = i;

      // При клике переходим на соответствующую страницу
      dot.addEventListener('click', () => {
        moveToPage(Number(dot.dataset.index));
      });

      paginationContainer.appendChild(dot);
    }
  }

  // === 3) Обновляем класс active у точек ===
  function updateActiveDot() {
    const dots = document.querySelectorAll('.main__reviews-dot');
    dots.forEach(d => d.classList.remove('active'));
    if (dots[currentPage]) {
      dots[currentPage].classList.add('active');
    }
  }

  // === 4) Перемещаем слайды на нужную «страницу» ===
  function moveToPage(pageIndex) {
    // Зацикливаем
    if (pageIndex < 0) {
      pageIndex = totalPages - 1;
    } else if (pageIndex >= totalPages) {
      pageIndex = 0;
    }
    currentPage = pageIndex;

    const wrapperWidth = wrapper.clientWidth;
    const shiftX = currentPage * wrapperWidth;
    slidesContainer.style.transform = `translateX(-${shiftX}px)`;

    updateActiveDot();
  }

  // === 5) Обработка свайпа (mobile) ===
  wrapper.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  wrapper.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX > SWIPE_THRESHOLD) {
      // свайп влево → следующая 📄
      moveToPage(currentPage + 1);
    } else if (diffX < -SWIPE_THRESHOLD) {
      // свайп вправо → предыдущая 📄
      moveToPage(currentPage - 1);
    }
  }, { passive: true });

  // === 6) При изменении размера окна: пересчитываем и корректируем ===
  window.addEventListener('resize', () => {
    const oldSlidesToShow = slidesToShow;
    calculateLayout();

    // Если slidesToShow изменился (3→1 или 2→3 и т. д.), перестраиваем точки
    if (slidesToShow !== oldSlidesToShow) {
      const oldPage = currentPage;
      calculateLayout();
      buildPagination();
      moveToPage(oldPage);
    } else {
      // Иначе просто двигаем «трейк» на новое смещение
      moveToPage(currentPage);
    }
  });

  // === 7) Инициализация ===
  calculateLayout();
  buildPagination();
  moveToPage(0);
});
