<script>
export default {
  name: 'AppSlideTransition',
  functional: true,
  props: {
    reverse: {
      type: Boolean,
      default: false,
    },
  },
  render(h, context) {
    return h('transition', {
      props: {
        name: context.props.reverse ? 'app-slide-transition--reverse' : 'app-slide-transition',
      },
      on: {
        beforeLeave(el) {
          el.style.position = 'absolute';
        },
      },
    }, context.children);
  },
};
</script>

<style lang="sass">
.app-slide-transition
  @mixin transition($value)
    &-enter-active, &-leave-active
      transition: all .4s ease
    &-enter
      opacity: 0
      transform: translateX(-$value)
    &-leave-to
      opacity: 0
      transform: translateX($value)

  $slide-move: 40px
  @include transition($slide-move)
  &--reverse
    @include transition(-$slide-move)
</style>
