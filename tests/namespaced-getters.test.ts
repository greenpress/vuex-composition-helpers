import {watch} from 'vue';
import {createStore, Module} from 'vuex';
import {shallowMount} from '@vue/test-utils';

import {useNamespacedGetters} from '../src/namespaced';

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
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{valGetter}}</div>',
					setup() {
						const {valGetter} = useNamespacedGetters(store, 'foo', ['valGetter']);
						return {
							valGetter
						}
					}
				},
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
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{valGetter}}</div>',
					setup() {
						const {valGetter} = useNamespacedGetters<Getters>(store, 'foo', ['valGetter']);
						return {
							valGetter
						}
					}
				},
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
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useNamespacedGetters(store, 'foo', ['testGetter']);
						return {
							val: testGetter
						}
					}
				},
			);

			// original value
			expect(wrapper.text()).toBe(storeModule.state.val);

			// change value, but not yet rendered
			store.state.foo.val = 'new value' + Math.random();
			expect(wrapper.text()).not.toBe(storeModule.state.val);

			// wait for rendering
			await wrapper.vm.$forceUpdate();

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
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useNamespacedGetters(store, 'foo', ['testGetter']);

						watch(testGetter, watcher);

						return {
							val: testGetter
						}
					}
				},
			);
			expect(watcher).toBeCalledTimes(0);
			store.state.foo.val = 'new value' + Math.random();

			// wait for rendering
			await wrapper.vm.$forceUpdate();

			expect(watcher).toBeCalledTimes(1);
		});

		it('should trigger a watcher according a typed getter change', async () => {
			const watcher = jest.fn();

			interface Getters {
				testGetter: (state: any) => String;
			}

			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			};
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useNamespacedGetters<Getters>(store, 'foo', ['testGetter']);

						watch(testGetter, watcher);

						return {
							val: testGetter
						}
					}
				},
			);
			expect(watcher).toBeCalledTimes(0);
			store.state.foo.val = 'new value' + Math.random();

			// wait for rendering
			await wrapper.vm.$forceUpdate();

			expect(watcher).toBeCalledTimes(1);
		});


		it('should not be able to mutate getter and trigger a warning', async () => {
			const storeModule: Module<any, any> = {
				namespaced: true,
				getters: {
					valGetter: (state) => 'original-value'
				}
			};
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const {valGetter} = useNamespacedGetters(store, 'foo', ['valGetter'])

			const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
			// @ts-ignore
			valGetter.value = 'some-value'
			expect(console.warn).toHaveBeenLastCalledWith("Write operation failed: computed value is readonly");
			consoleWarnMock.mockRestore();

			expect(valGetter.value).toBe('original-value');
		});

		it('should not be able to mutate getter objects and trigger a warning', async () => {

			const getters = {
				valGetter: () => ({
					nestedValue: {
						nestedValue2: 'original-value'
					}
				})
			}
			const storeModule: Module<any, any> = {
				namespaced: true,
				getters,
			};
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const {valGetter} = useNamespacedGetters<typeof getters>(store, 'foo', ['valGetter'])

			const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
			// @ts-ignore
			valGetter.value.nestedValue.nestedValue2 = 'changed-value'
			expect(console.warn).toHaveBeenLastCalledWith("Set operation on key \"nestedValue2\" failed: target is readonly.", valGetter.value.nestedValue);
			consoleWarnMock.mockRestore();

			expect(valGetter.value.nestedValue.nestedValue2).toBe('original-value');
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
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
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
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
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
			store.state.foo.val = 'new value' + Math.random();
			expect(wrapper.text()).not.toBe(storeModule.state.val);

			// wait for rendering
			await wrapper.vm.$forceUpdate();

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
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useNamespacedGetters(undefined, 'foo', ['testGetter']);

						watch(testGetter, watcher);

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
			expect(watcher).toBeCalledTimes(0);


			store.state.foo.val = 'new value' + Math.random();

			// wait for rendering
			await wrapper.vm.$forceUpdate();

			expect(watcher).toBeCalledTimes(1);
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
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
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
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
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
			store.state.foo.val = 'new value' + Math.random();
			expect(wrapper.text()).not.toBe(storeModule.state.val);

			// wait for rendering
			await wrapper.vm.$forceUpdate();

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
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useNamespacedGetters('foo', ['testGetter']);

						watch(testGetter, watcher);

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
			expect(watcher).toBeCalledTimes(0);

			store.state.foo.val = 'new value' + Math.random();

			// wait for rendering
			await wrapper.vm.$forceUpdate();

			expect(watcher).toBeCalledTimes(1);
		});
	});

});
