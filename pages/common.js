const ripeComponentsVue = process.client ? require("ripe-components-vue") : null;

export const PAGE_MIXINS = [];
if (ripeComponentsVue) {
    PAGE_MIXINS.push(ripeComponentsVue.partMixin);
}
