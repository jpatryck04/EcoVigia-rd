import type { App } from 'vue';

// Directiva para animaciones al hacer scroll
export const animateOnScroll = {
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

// Registrar todas las directivas
export const registerDirectives = (app: App) => {
  app.directive('animate-on-scroll', animateOnScroll);
};