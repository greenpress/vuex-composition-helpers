import Vue from 'vue';
import Vuex from 'vuex';
import {shallowMount} from '@vue/test-utils';

import {getLocalVue} from './utils/local-vue';
import {useGetters} from '../src/global';
import {watch} from '@vue/composition-api';

describe('"useGetters" - global store getters helpers', () => {
	let localVue: typeof Vue;

	beforeEach(() => {
		localVue = getLocalVue();
	});

	describe('when given both store and map', () => {
		it('should render component using a state getter', () => {
			const value = 'getter-demo' + Math.random();
			const store = new Vuex.Store({
				getters: {
					valGetter: (state) => value
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{valGetter}}</div>',
					setup() {
						const {valGetter} = useGetters(store, ['valGetter']);
						return {
							valGetter
						}
					}
				},
				{localVue}
			);

			expect(wrapper.text()).toBe(store.getters['valGetter']);
		});

		it('should change component contents according a getter change', async () => {
			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useGetters(store, ['testGetter']);
						return {
							val: testGetter
						}
					}
				},
				{localVue}
			);

			// original value
			expect(wrapper.text()).toBe(store.state.val);

			// change value, but not yet rendered
			store.state.val = 'new value' + Math.random();
			expect(wrapper.text()).not.toBe(store.state.val);

			// wait for rendering
			await wrapper.vm.$nextTick();

			// now it should be rendered
			expect(wrapper.text()).toBe(store.state.val);
		});

		it('should trigger a watcher according a getter change', async () => {
			const watcher = jest.fn();

			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useGetters(store, ['testGetter']);

						watch(testGetter, watcher);

						return {
							val: testGetter
						}
					}
				},
				{localVue}
			);
			expect(watcher).toBeCalledTimes(1);


			store.state.val = 'new value' + Math.random();

			expect(watcher).toBeCalledTimes(1);

			// wait for rendering
			await wrapper.vm.$nextTick();

			expect(watcher).toBeCalledTimes(2);
		});
	});

	describe('when given map only', () => {
		it('should render component using a state getter', () => {
			const value = 'getter-demo' + Math.random();
			const store = new Vuex.Store({
				getters: {
					valGetter: () => value
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{valGetter}}</div>',
					setup() {
						const {valGetter} = useGetters(['valGetter']);
						return {
							valGetter
						}
					}
				},
				{localVue, store}
			);

			expect(wrapper.text()).toBe(store.getters['valGetter']);
		});

		it('should change component contents according a getter change', async () => {
			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useGetters(['testGetter']);
						return {
							val: testGetter
						}
					}
				},
				{localVue, store}
			);

			// original value
			expect(wrapper.text()).toBe(store.state.val);

			// change value, but not yet rendered
			store.state.val = 'new value' + Math.random();
			expect(wrapper.text()).not.toBe(store.state.val);

			// wait for rendering
			await wrapper.vm.$nextTick();

			// now it should be rendered
			expect(wrapper.text()).toBe(store.state.val);
		});

		it('should trigger a watcher according a getter change', async () => {
			const watcher = jest.fn();

			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useGetters(['testGetter']);

						watch(testGetter, watcher);

						return {
							val: testGetter
						}
					}
				},
				{localVue, store}
			);
			expect(watcher).toBeCalledTimes(1);


			store.state.val = 'new value' + Math.random();

			expect(watcher).toBeCalledTimes(1);

			// wait for rendering
			await wrapper.vm.$nextTick();

			expect(watcher).toBeCalledTimes(2);
		});
	});
});
