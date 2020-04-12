import Vue from 'vue';
import Vuex, {Module} from 'vuex';
import {shallowMount} from '@vue/test-utils';

import {getLocalVue} from './utils/local-vue';
import {useNamespacedState} from '../src/namespaced';
import {watch} from '@vue/composition-api';

describe('"useNamespacedState" - namespaced store state helpers', () => {
	let localVue: typeof Vue;

	beforeEach(() => {
		localVue = getLocalVue();
	});

	describe('when given store in arguments', () => {
		it('should render component using a state value', () => {
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState(store, 'foo', ['val']);
						return {
							stateVal: val
						}
					}
				},
				{localVue}
			);

			expect(wrapper.text()).toBe(storeModule.state.val);
		});

		it('should change component contents according a state change', async () => {
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState(store, 'foo', ['val']);
						return {
							stateVal: val
						}
					}
				},
				{localVue}
			);

			// original value
			expect(wrapper.text()).toBe(storeModule.state.val);

			// change value, but not yet rendered
			storeModule.state.val = 'new value' + Math.random();
			expect(wrapper.text()).not.toBe(storeModule.state.val);

			// wait for rendering
			await wrapper.vm.$nextTick();

			// now it should be rendered
			expect(wrapper.text()).toBe(storeModule.state.val);
		});

		it('should trigger a watcher according a state change', async () => {
			const watcher = jest.fn();
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState(store, 'foo', ['val']);

						watch(val, watcher);

						return {
							stateVal: val
						}
					}
				},
				{localVue}
			);

			expect(watcher).toBeCalledTimes(1);

			storeModule.state.val = 'new value' + Math.random();

			expect(watcher).toBeCalledTimes(1);

			// wait for rendering
			await wrapper.vm.$nextTick();

			expect(watcher).toBeCalledTimes(2);

		});
	});

	describe('when store not given in arguments', () => {
		it('should render component using a state value', () => {
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState(undefined, 'foo', ['val']);
						return {
							stateVal: val
						}
					}
				},
				{localVue, store}
			);

			expect(wrapper.text()).toBe(storeModule.state.val);
		});

		it('should change component contents according a state change', async () => {
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState(undefined, 'foo', ['val']);
						return {
							stateVal: val
						}
					}
				},
				{localVue, store}
			);

			// original value
			expect(wrapper.text()).toBe(storeModule.state.val);

			// change value, but not yet rendered
			storeModule.state.val = 'new value' + Math.random();
			expect(wrapper.text()).not.toBe(storeModule.state.val);

			// wait for rendering
			await wrapper.vm.$nextTick();

			// now it should be rendered
			expect(wrapper.text()).toBe(storeModule.state.val);
		});

		it('should trigger a watcher according a state change', async () => {
			const watcher = jest.fn();
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState(undefined, 'foo', ['val']);

						watch(val, watcher);

						return {
							stateVal: val
						}
					}
				},
				{localVue, store}
			);

			expect(watcher).toBeCalledTimes(1);

			storeModule.state.val = 'new value' + Math.random();

			expect(watcher).toBeCalledTimes(1);

			// wait for rendering
			await wrapper.vm.$nextTick();

			expect(watcher).toBeCalledTimes(2);

		});
	});

	describe('when store not given in arguments', () => {
		it('should render component using a state value', () => {
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState('foo', ['val']);
						return {
							stateVal: val
						}
					}
				},
				{localVue, store}
			);

			expect(wrapper.text()).toBe(storeModule.state.val);
		});

		it('should change component contents according a state change', async () => {
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState('foo', ['val']);
						return {
							stateVal: val
						}
					}
				},
				{localVue, store}
			);

			// original value
			expect(wrapper.text()).toBe(storeModule.state.val);

			// change value, but not yet rendered
			storeModule.state.val = 'new value' + Math.random();
			expect(wrapper.text()).not.toBe(storeModule.state.val);

			// wait for rendering
			await wrapper.vm.$nextTick();

			// now it should be rendered
			expect(wrapper.text()).toBe(storeModule.state.val);
		});

		it('should trigger a watcher according a state change', async () => {
			const watcher = jest.fn();
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = new Vuex.Store({
				state: {},
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState('foo', ['val']);

						watch(val, watcher);

						return {
							stateVal: val
						}
					}
				},
				{localVue, store}
			);

			expect(watcher).toBeCalledTimes(1);

			storeModule.state.val = 'new value' + Math.random();

			expect(watcher).toBeCalledTimes(1);

			// wait for rendering
			await wrapper.vm.$nextTick();

			expect(watcher).toBeCalledTimes(2);

		});
	});

});
