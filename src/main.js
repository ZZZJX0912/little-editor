import Vue from 'vue';
import App from './app.vue';
import { Form, Input, Dialog, Button, FormItem } from 'element-ui';

Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);

new Vue({
  render: (h) =>h(App)
}).$mount('#app');
