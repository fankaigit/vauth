<template>
  <div id="app">
    <hello/>
  </div>
</template>

<script>
import Hello from './components/Hello'

export default {
  name: 'App',
  components: {
    Hello
  }
}
</script>

<style lang="scss">

  @import "~bulma/sass/utilities/_all";

  $twitter: #4099FF;
  $twitter-invert: findColorInvert($twitter);

  $colors: (
      "white": ($white, $black),
      "black": ($black, $white),
      "light": ($light, $light-invert),
      "dark": ($dark, $dark-invert),
      "primary": ($primary, $primary-invert),
      "info": ($info, $info-invert),
      "success": ($success, $success-invert),
      "warning": ($warning, $warning-invert),
      "danger": ($danger, $danger-invert),
      "twitter": ($twitter, $twitter-invert)
  );

  @import "~bulma";
  @import "~buefy/src/scss/buefy";

</style>
