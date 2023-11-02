import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
     theme: {
        themes: {
            light: {
                primary: '#2957A4',
                sucess: '#3cd1c2',
                info: '#ffaa2c',
                error: '#f83e70',
                corTracker1: '#2957A4'
            },
            dark: {
                primary: '#9652ff'
            }
        },
   } 
});
