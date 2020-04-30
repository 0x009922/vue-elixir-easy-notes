<template>
  <div
    class="app-input"
    :class="{
      'app-input--readonly': readonly,
    }"
  >
    <input
      v-if="!readonly"
      :value="lazyValue"
      v-bind="$attrs"
      @input="lazyUpdate($event.target.value)"
      @focus="isFocused = true"
      @blur="onBlur(), isFocused = false"
    >
    <div
      v-else
      class="app-input__readonly"
    >
      <template v-if="value">
        {{ value }}
      </template>
      <span
        v-else
        class="text--secondary"
      >
        Пусто
      </span>
    </div>

    <transition
      name="app-input__active-bottom-transition"
    >
      <div
        v-if="isFocused"
        class="app-input__active-bottom"
      />
    </transition>
  </div>
</template>

<script>
const UPDATE_DELAY = 400;

export default {
  name: 'AppInput',
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isFocused: false,

    lazyValue: null,
    updateTimer: null,
  }),
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.lazyValue = val;
      },
    },
  },
  methods: {
    lazyUpdate(val) {
      this.lazyValue = val;
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
      }
      this.updateTimer = setTimeout(this.update, UPDATE_DELAY);
    },
    onBlur() {
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
        this.updateTimer = null;
        this.update();
      }
    },
    update() {
      this.$emit('input', this.lazyValue);
      this.updateTimer = null;
    },
  },
};
</script>

<style lang="sass" scoped>
@use '@/assets/sass/colors'
@use '@/assets/sass/easings'

.app-input
  &:not(.app-input--readonly)
    border-bottom: 1px solid colors.$primary
  position: relative
  input
    padding: 8px
    width: 100%
    border: none
    &:focus
      outline: none

  &__readonly
    padding: 8px
    padding-left: 0
    font-size: 14px

  &__active-bottom
    position: absolute
    height: 3px
    bottom: -1px
    left: 0
    right: 0
    background: colors.$primary

  &__active-bottom-transition
    &-enter-active
      transition: all .25s easings.$out-expo
    &-leave-active
      transition: all .15s easings.$in-expo
    &-enter, &-leave-to
      opacity: 0
      left: 50%
      right: 50%
</style>
