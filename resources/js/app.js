import './bootstrap';
import {createApp} from "vue/dist/vue.esm-bundler.js";

import ComponentVue from './components/ComponentVue.vue';

createApp({
    components: {
        'component-vue': ComponentVue,
    }
}).mount('#app');
