<script>
import { mergeData } from 'vue-functional-data-merge';

export default {
  name: 'AppMdiIcon',
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
    const [{ text: iconName }] = context.children;

    const size = `${context.props.size}px`;

    return h('span', mergeData(context.data, {
      class: [
        'app-mdi-icon',
        `app-mdi-icon--${context.props.color}`,
        'mdi',
        `mdi-${iconName.trim()}`,
      ],
      style: {
        fontSize: size,
        width: size,
        height: size,
      },
    }));
  },
};
</script>

<style lang="sass" scoped>
@use '@/assets/sass/colors'

@mixin icon-theme($color)
  color: $color
  // path
  //   fill: $color
  //   stroke: $color

.app-mdi-icon
  &--primary
    @include icon-theme(colors.$primary)
  &--warning
    @include icon-theme(colors.$warning)
  &--disabled
    @include icon-theme(colors.$disabled)
  &--white
    @include icon-theme(white)
  &--success
    @include icon-theme(colors.$success)
</style>
