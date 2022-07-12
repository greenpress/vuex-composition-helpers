import {createLocalVue} from '@vue/test-utils';
import Vuex from 'vuex';
import Vue from 'vue';

export function getLocalVue(): typeof Vue {
	const Vue = createLocalVue();

	Vue.use(Vuex);

	return Vue;
}
