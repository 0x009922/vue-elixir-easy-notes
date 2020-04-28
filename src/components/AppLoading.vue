<script>
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
      ? h('span', 'loading...')
      : context.children[0];
    // return value ? 'loading...' : context.children[0];
  },
};
</script>
