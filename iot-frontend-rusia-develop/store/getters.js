export default {
  menuActive: (state) => (path) => state.items.find((x) => x.to === path) || {},
}
