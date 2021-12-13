import router from '@/router';

const HAS_LISTENER = 'has-listener';

const linkHandlerMixin = {
  updated() {
    const routerLinks = document.querySelectorAll('.custom-router-link');
    routerLinks.forEach((link) => {
      if (!link.getAttribute(HAS_LISTENER)) {
        link.setAttribute(HAS_LISTENER, 'true');
        link.addEventListener('click', this.handleRouterClick);
      }
    });
  },
  methods: {
    handleRouterClick(e) {
      e.preventDefault();
      router.push(e.target.pathname);
    },
  },
};

export default linkHandlerMixin;
