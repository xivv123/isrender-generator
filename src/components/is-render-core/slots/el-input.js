export default {
  prepend(h, conf, key) {
    return h('template', { slot: 'prepend' }, conf.__element__.slot[key]);
  },
  append(h, conf, key) {
    return h('template', { slot: 'append' }, conf.__element__.slot[key]);
  }
}
