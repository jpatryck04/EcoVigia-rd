import type { App, Directive } from 'vue';

// Directiva para animaciones al hacer scroll
export const animateOnScroll: Directive = {
  mounted(el: HTMLElement) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.classList.add('animate-in');
            observer.unobserve(el);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    observer.observe(el);
  }
};

// Directiva para contadores animados
export const counter: Directive = {
  mounted(el: HTMLElement, binding) {
    const target = Number(binding.value);
    if (isNaN(target)) return;
    
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  }
};

// Directiva para lazy loading de imágenes
export const lazyLoad: Directive = {
  mounted(el: HTMLImageElement, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.src = binding.value;
          observer.unobserve(el);
        }
      });
    });
    
    observer.observe(el);
  }
};

// Registrar todas las directivas
export const registerDirectives = (app: App) => {
  app.directive('animate-on-scroll', animateOnScroll);
  app.directive('counter', counter);
  app.directive('lazy-load', lazyLoad);
};