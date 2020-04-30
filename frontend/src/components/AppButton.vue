<template>
  <div
    role="button"
    class="app-button"
    :class="classes"
    v-on="$listeners"
  >
    <app-mdi-icon
      v-if="icon"
      :color="iconColor"
      size="24"
    >
      <slot />
    </app-mdi-icon>
    <slot v-else />

    <div
      v-if="loading"
      class="app-button__loading-overlay d-flex align-center justify-center"
    >
      <app-loading :color="iconColor" />
    </div>
  </div>
</template>

<script>
/**
 * Стандартная кнопка приложения.
 */
export default {
  name: 'AppButton',
  props: {
    /**
     * Показывать ли лоадер вместо текста
     */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * Выключить ли кнопку, сделать ли неактивной
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Является ли кнопка - кнопкой с иконкой.
     * Если является, то слот автоматически будет вставлен в AppMdiIcon
     */
    icon: {
      type: Boolean,
      default: false,
    },
    /**
     * 'Опасная' стилистика кнопки
     */
    warning: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    /**
     * Формирование списка классов из props в формате app-button--{style}
     */
    classes() {
      return Object.entries(this.$props)
        .reduce((prev, [key, value]) => {
          prev[`app-button--${key}`] = value;
          return prev;
        }, {});
    },
    /**
     * Цвет иконки/лоадера
     */
    iconColor() {
      // eslint-disable-next-line no-nested-ternary
      return this.disabled
        ? 'disabled'
        : this.warning
          ? 'warning'
          : 'primary';
    },
  },
};
</script>

<style lang="sass" scoped>
@use '@/assets/sass/colors'
@use '@/assets/sass/mixins'
@use '@/assets/sass/easings'

$shadow: 3px

@mixin round-corners($val)
  border-radius: $val
  &:after
    border-radius: $val

@mixin colorize($color)
  color: $color
  &:not(.app-button--icon)
    box-shadow: 0 $shadow 0 lighten($color, 20)
    &:active
      box-shadow: 0 0 0 lighten($color, 20)
  &:after
    border: 1px solid $color
  &.app-button--icon:hover
    background: transparentize($color, 0.9)

.app-button
  @include round-corners(4px)
  @include colorize(colors.$primary)

  display: inline-flex
  position: relative
  align-items: center
  justify-content: center
  padding: 8px
  cursor: pointer
  font-size: 14px
  font-weight: 600
  text-transform: uppercase
  user-select: none

  &:not(.app-button--icon)
    &:active
      transform: translateY($shadow)
      &:after
        bottom: 0
    &:after
      content: ''
      pointer-events: none
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: -$shadow

  &--icon
    @include round-corners(50%)
    @include mixins.pressable

  &--disabled
    pointer-events: none
    // opacity: 0.5
    @include colorize(colors.$disabled)

  &--warning
    @include colorize(colors.$warning)

  &--loading
    color: transparent !important
    pointer-events: none

  &__loading-overlay
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
</style>
