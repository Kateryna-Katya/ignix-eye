document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Инициализация иконок (Lucide) ---
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  } else {
      console.warn('Lucide Icons library not found');
  }

  // --- 2. Плавный скролл (Lenis) ---
  // Проверка на существование библиотеки
  if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          smooth: true
      });

      function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
  }

  // --- 3. Мобильное меню ---
  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  if (burger && mobileMenu) {
      const toggleMenu = () => {
          mobileMenu.classList.toggle('is-active');
          burger.classList.toggle('is-active');

          const lines = burger.querySelectorAll('.header__burger-line');
          if (mobileMenu.classList.contains('is-active')) {
              lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
              lines[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
          } else {
              lines[0].style.transform = 'none';
              lines[1].style.transform = 'none';
          }
      };

      burger.addEventListener('click', toggleMenu);
      mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));
  }

  // --- 4. Хедер при скролле ---
  const header = document.querySelector('.header');
  if (header) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > 50) {
              header.style.background = 'rgba(11, 12, 16, 0.95)';
              header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
          } else {
              header.style.background = 'rgba(11, 12, 16, 0.85)';
              header.style.boxShadow = 'none';
          }
      });
  }

  // --- 5. Анимации GSAP (Основное исправление) ---
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Анимация заголовков (SplitType) с проверкой
      if (typeof SplitType !== 'undefined') {
          const splitTypes = document.querySelectorAll('.reveal-text');
          splitTypes.forEach((char) => {
              const text = new SplitType(char, { types: 'chars' });
              gsap.from(text.chars, {
                  scrollTrigger: {
                      trigger: char,
                      start: 'top 85%',
                      toggleActions: 'play none none reverse'
                  },
                  y: 50,
                  opacity: 0,
                  stagger: 0.02,
                  duration: 0.8,
                  ease: 'back.out(1.7)'
              });
          });
      }

      // Простое появление (Fade In)
      const fadeElements = document.querySelectorAll('.fade-in');
      fadeElements.forEach(el => {
          gsap.fromTo(el,
              { opacity: 0, y: 30 },
              {
                  opacity: 1,
                  y: 0,
                  duration: 1,
                  ease: 'power3.out',
                  scrollTrigger: {
                      trigger: el,
                      start: 'top 90%',
                  }
              }
          );
      });

      // ИСПРАВЛЕНИЕ: Пакетная анимация для карточек (.fade-in-up)
      // Вместо forEach используем batch, чтобы гарантировать запуск для всех
      ScrollTrigger.batch(".fade-in-up", {
          onEnter: batch => {
              gsap.to(batch, {
                  opacity: 1,
                  y: 0,
                  stagger: 0.15, // Задержка между появлением элементов
                  duration: 0.8,
                  ease: "power2.out",
                  overwrite: true
              });
          },
          // Начальное состояние задаем здесь, чтобы они не были видны до скролла
          onRefresh: batch => {
              gsap.set(batch, { opacity: 0, y: 50 });
          }
      });

      // Принудительно скрываем элементы перед началом анимации
      gsap.set(".fade-in-up", { opacity: 0, y: 50 });

  } else {
      console.error('GSAP or ScrollTrigger not loaded');
  }

  // --- 6. Форма и Валидация ---
  const form = document.getElementById('consultationForm');
  if (form) {
      const phoneInput = document.getElementById('phone');
      const captchaTask = document.getElementById('captcha-task');
      const captchaInput = document.getElementById('captcha-input');
      const captchaError = document.getElementById('captcha-error');
      const formStatus = document.getElementById('formStatus');

      // Только цифры
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/[^0-9+]/g, '');
      });

      // Капча
      let num1 = Math.floor(Math.random() * 10) + 1;
      let num2 = Math.floor(Math.random() * 10) + 1;
      let captchaResult = num1 + num2;
      if (captchaTask) captchaTask.textContent = `${num1} + ${num2} = ?`;

      form.addEventListener('submit', (e) => {
          e.preventDefault();
          let isValid = true;

          // Валидация пустых полей
          const inputs = form.querySelectorAll('input[required]');
          inputs.forEach(input => {
              const group = input.closest('.form-group');
              if (!input.value.trim()) {
                  if (group) group.classList.add('error');
                  isValid = false;
              } else {
                  if (group) group.classList.remove('error');
              }
          });

          // Проверка капчи
          if (parseInt(captchaInput.value) !== captchaResult) {
              const group = captchaInput.closest('.form-group');
              if (group) group.classList.add('error');
              if (captchaError) captchaError.style.display = 'block';
              isValid = false;
          } else {
              const group = captchaInput.closest('.form-group');
              if (group) group.classList.remove('error');
              if (captchaError) captchaError.style.display = 'none';
          }

          if (isValid) {
              const btn = form.querySelector('button[type="submit"]');
              const oldText = btn.textContent;
              btn.textContent = 'Отправка...';
              btn.disabled = true;

              setTimeout(() => {
                  form.style.display = 'none';
                  if (formStatus) {
                      formStatus.style.display = 'flex';
                      formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
              }, 1500);
          }
      });
  }

  // --- 7. Cookies ---
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptBtn = document.getElementById('acceptCookies');

  if (cookiePopup && acceptBtn) {
      if (!localStorage.getItem('cookiesAccepted')) {
          setTimeout(() => {
              cookiePopup.classList.add('show');
          }, 2000);
      }

      acceptBtn.addEventListener('click', () => {
          localStorage.setItem('cookiesAccepted', 'true');
          cookiePopup.classList.remove('show');
      });
  }
});

// Дополнительный пересчет скролла после полной загрузки страницы (картинок и шрифтов)
window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
  }
});