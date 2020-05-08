<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon style='fontSize:20px;marginBottom:-3px;marginRight:10px' icon-class={icon}/>)
    }

    if (title) {
      if (!icon) {
        vnodes.push(<span class='has-margin' slot='title'>{(title)}</span>)
      } else {
        vnodes.push(<span slot='title'>{(title)}</span>)
      }
    }
    return vnodes
  }
}
</script>
<style scoped>
  .has-margin{
    margin-left: 5px;
  }
</style>
