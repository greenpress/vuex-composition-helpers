import Vuex, {Module} from 'vuex';
import {shallowMount} from '@vue/test-utils';

import {useNamespacedGetters} from '../src/namespaced';
import {watch} from 'vue';

describe('"useNamespacedGetters" - namespaced store state helpers', () => {
	describe('when given store in arguments', () => {
		it('should render component using a state getter', () => {
			const value = 'getter-demo' + Math.random();

			const storeModule: Module<any, any> = {
				namespaced: true,
				getters: {
					valGetter: () => value
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{valGetter}}</div>',
					setup() {
						const {valGetter} = useNamespacedGetters(store, 'foo', ['valGetter']);
						return {
							valGetter
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
			);

			expect(wrapper.text()).toBe(store.getters['foo/valGetter']);
			expect(wrapper.text()).toBe(value);
		});

		it('should render component using a typed state getter', () => {
			interface Getters {
				valGetter: (state: any) => String;
			};
			const value = 'getter-demo' + Math.random();

			const storeModule: Module<any, any> = {
				namespaced: true,
				getters: {
					valGetter: () => value
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{valGetter}}</div>',
					setup() {
						const {valGetter} = useNamespacedGetters<Getters>(store, 'foo', ['valGetter']);
						return {
							valGetter
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
			);

			expect(wrapper.text()).toBe(store.getters['foo/valGetter']);
			expect(wrapper.text()).toBe(value);
		});

		it('should change component contents according a getter change', async () => {
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useNamespacedGetters(store, 'foo', ['testGetter']);
						return {
							val: testGetter
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
			);

			// original value
			expect(wrapper.text()).toBe(storeModule.state.val);

			// change value, but not yet rendered
			storeModule.state.val = 'new value' + Math.random();
			expect(wrapper.text()).not.toBe(storeModule.state.val);

			// wait for rendering
			await (wrapper.vm as any).$nextTick();

			// now it should be rendered
			expect(wrapper.text()).toBe(storeModule.state.val);
		});

		it('should trigger a watcher according a getter change', async () => {
			const watcher = jest.fn();
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useNamespacedGetters(store, 'foo', ['testGetter']);

						watch(testGetter, watcher, {immediate: true});

						return {
							val: testGetter
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
			);
			expect(watcher).toBeCalledTimes(1);


			storeModule.state.val = 'new value' + Math.random();

			expect(watcher).toBeCalledTimes(1);

			// wait for rendering
			await (wrapper.vm as any).$nextTick();

			expect(watcher).toBeCalledTimes(2);
		});

		it('should trigger a watcher according a typed getter change', async () => {
			const watcher = jest.fn();
			interface Getters {
				testGetter: (state: any) => String;
			};
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useNamespacedGetters<Getters>(store, 'foo', ['testGetter']);

						watch(testGetter, watcher, {immediate: true});

						return {
							val: testGetter
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
			);
			expect(watcher).toBeCalledTimes(1);


			storeModule.state.val = 'new value' + Math.random();

			expect(watcher).toBeCalledTimes(1);

			// wait for rendering
			await (wrapper.vm as any).$nextTick();

			expect(watcher).toBeCalledTimes(2);
		});
	});

	describe('when given store in argument is undefined', () => {
		it('should render component using a state getter', () => {
			const value = 'getter-demo' + Math.random();

			const storeModule: Module<any, any> = {
				namespaced: true,
				getters: {
					valGetter: () => value
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{valGetter}}</div>',
					setup() {
						const {valGetter} = useNamespacedGetters(undefined, 'foo', ['valGetter']);
						return {
							valGetter
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
			);

			expect(wrapper.text()).toBe(store.getters['foo/valGetter']);
			expect(wrapper.text()).toBe(value);
		});

		it('should change component contents according a getter change', async () => {
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useNamespacedGetters(undefined, 'foo', ['testGetter']);
						return {
							val: testGetter
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
			);

			// original value
			expect(wrapper.text()).toBe(storeModule.state.val);

			// change value, but not yet rendered
			storeModule.state.val = 'new value' + Math.random();
			expect(wrapper.text()).not.toBe(storeModule.state.val);

			// wait for rendering
			await (wrapper.vm as any).$nextTick();

			// now it should be rendered
			expect(wrapper.text()).toBe(storeModule.state.val);
		});

		it('should trigger a watcher according a getter change', async () => {
			const watcher = jest.fn();
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useNamespacedGetters(undefined, 'foo', ['testGetter']);

						watch(testGetter, watcher, {immediate: true});

						return {
							val: testGetter
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
			);
			expect(watcher).toBeCalledTimes(1);


			storeModule.state.val = 'new value' + Math.random();

			expect(watcher).toBeCalledTimes(1);

			// wait for rendering
			await (wrapper.vm as any).$nextTick();

			expect(watcher).toBeCalledTimes(2);
		});
	});

	describe('when store not given in arguments', () => {
		it('should render component using a state getter', () => {
			const value = 'getter-demo' + Math.random();

			const storeModule: Module<any, any> = {
				namespaced: true,
				getters: {
					valGetter: () => value
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{valGetter}}</div>',
					setup() {
						const {valGetter} = useNamespacedGetters('foo', ['valGetter']);
						return {
							valGetter
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
			);

			expect(wrapper.text()).toBe(store.getters['foo/valGetter']);
			expect(wrapper.text()).toBe(value);
		});

		it('should change component contents according a getter change', async () => {
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useNamespacedGetters('foo', ['testGetter']);
						return {
							val: testGetter
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
			);

			// original value
			expect(wrapper.text()).toBe(storeModule.state.val);

			// change value, but not yet rendered
			storeModule.state.val = 'new value' + Math.random();
			expect(wrapper.text()).not.toBe(storeModule.state.val);

			// wait for rendering
			await (wrapper.vm as any).$nextTick();

			// now it should be rendered
			expect(wrapper.text()).toBe(storeModule.state.val);
		});

		it('should trigger a watcher according a getter change', async () => {
			const watcher = jest.fn();
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			};
			const store = new Vuex.Store({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useNamespacedGetters('foo', ['testGetter']);

						watch(testGetter, watcher, {immediate: true});

						return {
							val: testGetter
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
			);
			expect(watcher).toBeCalledTimes(1);


			storeModule.state.val = 'new value' + Math.random();

			expect(watcher).toBeCalledTimes(1);

			// wait for rendering
			await (wrapper.vm as any).$nextTick();

			expect(watcher).toBeCalledTimes(2);
		});
	});

});
