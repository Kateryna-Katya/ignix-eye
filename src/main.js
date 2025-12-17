document.addEventListener('DOMContentLoaded', () => {
  // 1. Инициализация иконок
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  }

  // 2. Плавный скролл (Lenis)
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

  // 3. Меню (Mobile Burger)
  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

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

  // 4. Header Background on Scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          header.style.background = 'rgba(11, 12, 16, 0.95)';
          header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
      } else {
          header.style.background = 'rgba(11, 12, 16, 0.85)';
          header.style.boxShadow = 'none';
      }
  });

  // 5. GSAP Анимации
  gsap.registerPlugin(ScrollTrigger);

  // Анимация текста (SplitType)
  const splitTypes = document.querySelectorAll('.reveal-text');

  splitTypes.forEach((char, i) => {
      const text = new SplitType(char, { types: 'chars' });

      gsap.from(text.chars, {
          scrollTrigger: {
              trigger: char,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
          },
          y: 50,
          opacity: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: 'back.out(1.7)'
      });
  });

  // Fade In (простое появление)
  gsap.utils.toArray('.fade-in').forEach(element => {
      gsap.from(element, {
          scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
          },
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
      });
  });

  // Fade In Up (для карточек с задержкой)
  gsap.utils.toArray('.fade-in-up').forEach(element => {
      const delay = element.getAttribute('data-delay') || 0;
      gsap.from(element, {
          scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: delay,
          ease: 'power2.out'
      });
  });

  // 6. Форма Контактов (Валидация + Капча)
  const form = document.getElementById('consultationForm');
  const phoneInput = document.getElementById('phone');
  const captchaTask = document.getElementById('captcha-task');
  const captchaInput = document.getElementById('captcha-input');
  const captchaError = document.getElementById('captcha-error');
  const formStatus = document.getElementById('formStatus');

  // Разрешаем только цифры в телефоне
  phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9+]/g, '');
  });

  // Генерация мат. капчи
  let num1, num2, captchaResult;
  function generateCaptcha() {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      captchaResult = num1 + num2;
      captchaTask.textContent = `${num1} + ${num2} = ?`;
      captchaInput.value = ''; // очистка
  }
  generateCaptcha();

  // Обработка отправки
  form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Простая валидация полей
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
      const userCaptcha = parseInt(captchaInput.value);
      const captchaGroup = captchaInput.closest('.form-group');

      if (userCaptcha !== captchaResult) {
          captchaGroup.classList.add('error');
          captchaError.style.display = 'block';
          isValid = false;
      } else {
          captchaGroup.classList.remove('error');
          captchaError.style.display = 'none';
      }

      if (isValid) {
          // Имитация AJAX
          const btn = form.querySelector('button[type="submit"]');
          const originalBtnText = btn.textContent;

          btn.textContent = 'Отправка...';
          btn.disabled = true;

          setTimeout(() => {
              form.style.display = 'none';
              formStatus.style.display = 'flex';
              // Скролл к сообщению
              formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 1500);
      }
  });

  // 7. Cookie Popup
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptBtn = document.getElementById('acceptCookies');

  // Проверка localStorage
  if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
          cookiePopup.classList.add('show');
      }, 2000);
  }

  acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookiePopup.classList.remove('show');
  });
});