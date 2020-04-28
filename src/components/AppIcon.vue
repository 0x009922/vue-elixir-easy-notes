<script>
import { mergeData } from 'vue-functional-data-merge';

export default {
  name: 'AppIcon',
  functional: true,
  props: {
    size: {
      type: [Number, String],
      default: 20,
    },
    color: {
      type: String,
      default: 'primary',
    },
  },
  render(h, context) {
    const [{ text: svgPath }] = context.children;

    return h('svg', mergeData(context.data, {
      staticClass: 'app-icon',
      class: `app-icon--${context.props.color}`,
      attrs: {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        width: context.props.size,
        height: context.props.size,
      },
    }), [
      h('path', {
        attrs: { d: svgPath },
      }),
    ]);
  },
};
</script>

<style lang="sass" scoped>
@mixin icon-theme($color)
  path
    fill: $color
    stroke: $color

svg.app-icon
  &--primary
    @include icon-theme(black)
</style>
