<template>
  <div
    class="app-input"
    :class="{
      'app-input--readonly': readonly,
    }"
  >
    <input
      v-if="!readonly"
      :value="value"
      v-bind="$attrs"
      @input="debouncedUpdate($event.target.value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
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
import debounce from 'lodash/debounce';

export default {
  name: 'AppInput',
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isFocused: false,
  }),
  methods: {
    debouncedUpdate: debounce(function (val) {
      this.$emit('input', val);
    }, 500),
  },
};
</script>

<style lang="sass" scoped>
.app-input
  &:not(.app-input--readonly)
    border-bottom: 1px solid gray
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
    height: 2px
    bottom: -1px
    left: 0
    right: 0
    background: black

  &__active-bottom-transition
    &-enter-active, &-leave-active
      transition: all .25s ease
    &-enter, &-leave-to
      opacity: 0
      left: 50%
      right: 50%
</style>
