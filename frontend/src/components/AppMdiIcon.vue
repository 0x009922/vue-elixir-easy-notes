<script>
import { mergeData } from 'vue-functional-data-merge';

/**
 * Специальный компонент для отображения иконок mdi.
 * название иконки берёт из текста переданного слота.
 */
export default {
  name: 'AppMdiIcon',
  functional: true,
  props: {
    /**
     * Размер иконки, в px
     */
    size: {
      type: [Number, String],
      default: 20,
    },
    /**
     * Цвет иконки. Доступные значения в теге <style> ниже
     */
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

.app-mdi-icon
  &--primary
    @include icon-theme(colors.$primary)
  &--warning
    @include icon-theme(colors.$warning)
  &--disabled
    @include icon-theme(colors.$disabled)
  &--white
    @include icon-theme(white)
</style>
