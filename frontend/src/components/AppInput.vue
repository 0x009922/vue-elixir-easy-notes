<template>
  <div
    class="app-input"
  >
    <input
      :value="lazyValue"
      v-bind="$attrs"
      @input="lazyUpdate($event.target.value)"
      @focus="isFocused = true"
      @blur="onBlur(), isFocused = false"
    >

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

/**
 * Стилизованный инпут.
 * Автоматически 'откладывает' ввод пользователя, лениво
 * сообщает об изменениях.
 */
export default {
  name: 'AppInput',
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
  },
  data: () => ({
    // Находится ли в фокусе
    isFocused: false,

    // 'Ленивое' значение инпута. Сначала выставляется оно, потому делается emit('input')
    lazyValue: null,

    // Установленный таймер для отдачи данных выше
    updateTimer: null,
  }),
  watch: {
    // При изменении 'источника истины' сразу устанавливать локальное ленивое значение
    value: {
      immediate: true,
      handler(val) {
        this.lazyValue = val;
      },
    },
  },
  methods: {
    /**
     * Ленивое обновление данных
     */
    lazyUpdate(val) {
      this.lazyValue = val;
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
      }
      this.updateTimer = setTimeout(this.update, UPDATE_DELAY);
    },
    /**
     * Обработка потери фокуса. В этом случае нужно немедленно отдавать
     * данные наверх, если это было запланировано
     */
    onBlur() {
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
        this.update();
      }
    },
    /**
     * Отдача данных выше и очистка таймера
     */
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
  border-bottom: 1px solid colors.$disabled
  position: relative
  input
    padding: 8px
    width: 100%
    border: none
    &:focus
      outline: none

  &__active-bottom
    position: absolute
    height: 2px
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
