<template>
  <about-layout id="Privacy" title="Privacy">
    <template v-slot:contents>
      <p>
        Metabolic Atlas gathers information about users solely to improve the usability and
        usefulness of the website. There are two types of cookies that are set by Metabolic Atlas:
        functionality cookies and tracking cookies.
      </p>
      Functionality cookies are used to personalize the appearence of the Metabolic Atlas.
      <p>
        Tracking cookies are used by our private analytics to track the users on our website. We use
        these to observe the anonymized behaviour on our website in order to improve it. We store
        partial IP, operating system, browser and browser language. This information is stored
        permanently for statistics and is not shared with any third party.
      </p>
      <p>
        Additionally, we use the services of
        <a href="https://www.hotjar.com/" target="_blank">Hotjar</a>
        . This is an additional independent tracking service, which can produce a screen capture of
        the interactions on our website, including mouse movement. We use it solely for the purpose
        of figuring out how to improve our website, for example when the website interface is
        confusing. The data is stored for at most 3 months. Hotjar adheres to GDPR,
        <a href="https://www.hotjar.com/legal/compliance/gdpr-commitment" target="_blank">
          see more on their website
        </a>
        .
      </p>
      <p>
        To opt out of any of these cookies, please set your browser to use the "DoNotTrack" header;
        doing this will disable the tracking. It is a good practice to enable this setting, here is
        how to do this for
        <a href="https://support.google.com/chrome/answer/2790761" target="_blank">Chrome</a>
        and
        <a
          href="https://support.mozilla.org/en-US/kb/how-do-i-turn-do-not-track-feature"
          target="_blank"
        >
          Firefox
        </a>
        (in Safari this is enabled by default). Alternatively, see
        <a href="https://www.hotjar.com/legal/compliance/opt-out" target="_blank">
          Hotjar's instructions on their website
        </a>
        .
      </p>

      <p>
        If you have any questions, please email us at
        <a href="mailto:contact@metabolicatlas.org">contact [at] metabolicatlas [dot] org</a>
        .
      </p>
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout';

export default {
  name: 'Privacy',
  components: {
    AboutLayout,
  },
};
</script>
