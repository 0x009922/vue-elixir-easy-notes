<script>
import { mdiLoading } from '@mdi/js';

export default {
  name: 'AppLoading',
  functional: true,
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  render(h, context) {
    const { value } = context.props;
    return value
      ? h('app-icon', {
        class: 'app-loading',
      }, [mdiLoading])
      : context.children[0];
  },
};
</script>

<style lang="sass">
@keyframes appLoadingRotation
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)

.app-loading
  animation-name: appLoadingRotation
  animation-duration: .5s
  animation-iteration-count: infinite
  animation-timing-function: ease
</style>
