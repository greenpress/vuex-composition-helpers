import {watch} from 'vue';
import {createStore, Module} from 'vuex';
import {shallowMount} from '@vue/test-utils';

import {useNamespacedState} from '../src/namespaced';

describe('"useNamespacedState" - namespaced store state helpers', () => {
	describe('when given store in arguments', () => {
		it('should return a nested state value', () => {
			const nestedStoreModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const storeModule: Module<any, any> = {
				namespaced: true,
				modules: {
					bar: nestedStoreModule
				}
			};
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
				props: {},
				template: '<div>{{stateVal}}</div>',
				setup() {
					const {val} = useNamespacedState(store, 'foo/bar', ['val']);
					return {
						stateVal: val
					}
				}
			});

			expect(wrapper.text()).toBe(nestedStoreModule.state.val);
		});

		it('should render component using a state value', () => {
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState(store, 'foo', ['val']);
						return {
							stateVal: val
						}
					}
				},
			);

			expect(wrapper.text()).toBe(storeModule.state.val);
		});

		it('should render component using a typed state value', () => {
			interface ModuleState {
				val: string
			}

			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState<ModuleState>(store, 'foo', ['val']);
						return {
							stateVal: val
						}
					}
				},
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
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState(store, 'foo', ['val']);
						return {
							stateVal: val
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

		it('should trigger a watcher according a state change', async () => {
			const watcher = jest.fn();
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState(store, 'foo', ['val']);

						watch(val, watcher);

						return {
							stateVal: val
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

		it('should not be able to mutate state directly and trigger a warning', async () => {

			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'original-value'
				}
			};
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const {val} = useNamespacedState(store, 'foo', ['val'])

			const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
			// @ts-ignore
			val.value = 'some-value'
			expect(console.warn).toHaveBeenLastCalledWith("Write operation failed: computed value is readonly");
			consoleWarnMock.mockRestore();

			expect(store.state.foo.val).toBe('original-value');
		});

		it('should not be able to mutate state objects directly and trigger a warning', async () => {
			const state = {
					val: {
						nestedValue: {
							nestedValue2: 'original-value'
						}
					}
				}
			const storeModule: Module<any, any> = {
				namespaced: true,
				state,
			};
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const {val} = useNamespacedState<typeof state>(store, 'foo', ['val'])

			const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
			// @ts-ignore
			val.value.nestedValue.nestedValue2 = 'changed-value'
			expect(console.warn).toHaveBeenLastCalledWith("Set operation on key \"nestedValue2\" failed: target is readonly.", val.value.nestedValue);
			consoleWarnMock.mockRestore();

			expect(store.state.foo.val.nestedValue.nestedValue2).toBe('original-value');
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
			const store = createStore({
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
				{
					global: {
						plugins: [store]
					}
				}
			);

			expect(wrapper.text()).toBe(storeModule.state.val);
		});
		it('should render component using a typed state value', () => {
			interface ModuleState {
				val: string;
			}

			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState<ModuleState>(undefined, 'foo', ['val']);
						return {
							stateVal: val
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
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
			const store = createStore({
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

		it('should trigger a watcher according a state change', async () => {
			const watcher = jest.fn();
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState(undefined, 'foo', ['val']);

						watch(val, watcher);

						return {
							stateVal: val
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
		it('should render component using a state value', () => {
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState('foo', ['val']);
						return {
							stateVal: val
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
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
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState('foo', ['val']);
						return {
							stateVal: val
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

		it('should trigger a watcher according a state change', async () => {
			const watcher = jest.fn();
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				}
			};
			const store = createStore({
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useNamespacedState('foo', ['val']);

						watch(val, watcher);

						return {
							stateVal: val
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
