import {watch, computed} from 'vue';
import {createStore, GetterTree} from 'vuex';
import {shallowMount} from '@vue/test-utils';

import {useGetters} from '../src/global';

describe('"useGetters" - global store getters helpers', () => {
	describe('when given both store and map', () => {
		it('should render component using a state getter', () => {
			const value = 'getter-demo' + Math.random();
			const store = createStore({
				getters: {
					valGetter: (state) => value
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{valGetter}}</div>',
					setup() {
						const {valGetter} = useGetters(store, ['valGetter']);
						return {
							valGetter
						}
					}
				}
			);

			expect(wrapper.text()).toBe(store.getters['valGetter']);
		});

		it('should render component using a state getter with params', () => {
			const value = 'getter-demo' + Math.random();
			const store = createStore({
				getters: {
					valGetter: (state) => (prefix: string) => `${prefix}${value}`
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: `
						<div>{{ valGetter('Foobar') }}</div>`,
					setup() {
						const {valGetter} = useGetters(store, ['valGetter']);
						return {
							valGetter
						}
					}
				}
			);

			expect(wrapper.text()).toBe(store.getters['valGetter']('Foobar'));
		});

		it('should render component using a typed state getter', () => {
			interface Getters {
				valGetter: (state: any) => String;
			}

			const value = 'getter-demo' + Math.random();
			const store = createStore({
				getters: {
					valGetter: (state) => value
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{valGetter}}</div>',
					setup() {
						const {valGetter} = useGetters<Getters>(store, ['valGetter']);
						return {
							valGetter
						}
					}
				}
			);

			expect(wrapper.text()).toBe(store.getters['valGetter']);
		});

		it('should render component using a typed state getter with params', () => {
			interface Getters {
				valGetter: (state: any) => (_: string) => string;
			}

			const value = 'getter-demo' + Math.random();
			const store = createStore({
				state: {
					val: value
				},
				getters: {
					valGetter: (state) => (prefix: string) => `${prefix}${state.val}`
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: `
						<div>{{ val }}</div>`,
					setup() {
						const {valGetter} = useGetters<Getters>(store, ['valGetter']);
						const val = computed(() => valGetter.value('Foobar'))
						return {
							val
						}
					}
				}
			);

			expect(wrapper.text()).toBe(store.getters['valGetter']('Foobar'));
		});

		it('should change component contents according a getter change', async () => {
			const store = createStore({
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useGetters(store, ['testGetter']);
						return {
							val: testGetter
						}
					}
				}
			);

			// original value
			expect(wrapper.text()).toBe(store.state.val);

			// change value, but not yet rendered
			store.state.val = 'new value' + Math.random();
			expect(wrapper.text()).not.toBe(store.state.val);

			// wait for rendering
			await wrapper.vm.$forceUpdate();

			// now it should be rendered
			expect(wrapper.text()).toBe(store.state.val);
		});

		it('should trigger a watcher according a getter change', async () => {
			const watcher = jest.fn();

			const store = createStore({
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useGetters(store, ['testGetter']);

						watch(testGetter, watcher);

						return {
							val: testGetter
						}
					}
				}
			);
			expect(watcher).toBeCalledTimes(0);

			store.state.val = 'new value' + Math.random();

			// wait for rendering
			await wrapper.vm.$forceUpdate();

			expect(watcher).toBeCalledTimes(1);
		});

		it('should trigger a watcher according a typed getter change', async () => {
			const watcher = jest.fn();

			interface Getters extends GetterTree<any, any> {
				testGetter: (state: any) => String;
			}

			const store = createStore({
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useGetters<Getters>(store, ['testGetter']);

						watch(testGetter, watcher);

						return {
							val: testGetter
						}
					}
				}
			);
			expect(watcher).toBeCalledTimes(0);

			store.state.val = 'new value' + Math.random();

			// wait for rendering
			await wrapper.vm.$forceUpdate();

			expect(watcher).toBeCalledTimes(1);
		});

		it('should not be able to mutate getter and trigger a warning', async () => {
			const store = createStore({
				getters: {
					valGetter: (state) => 'original-value'
				}
			});

			const {valGetter} = useGetters(store, ['valGetter'])

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
			const store = createStore({
				getters
			});

			const {valGetter} = useGetters<typeof getters>(store, ['valGetter'])

			const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
			// @ts-ignore
			valGetter.value.nestedValue.nestedValue2 = 'changed-value'
			expect(console.warn).toHaveBeenLastCalledWith("Set operation on key \"nestedValue2\" failed: target is readonly.", valGetter.value.nestedValue);
			consoleWarnMock.mockRestore();


			expect(valGetter.value.nestedValue.nestedValue2).toBe('original-value');
		});
	});

	describe('when given map only', () => {
		it('should render component using a state getter', () => {
			const value = 'getter-demo' + Math.random();
			const store = createStore({
				getters: {
					valGetter: () => value
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{valGetter}}</div>',
					setup() {
						const {valGetter} = useGetters(['valGetter']);
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

			expect(wrapper.text()).toBe(store.getters['valGetter']);
		});

		it('should change component contents according a getter change', async () => {
			const store = createStore({
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useGetters(['testGetter']);
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
			expect(wrapper.text()).toBe(store.state.val);

			// change value, but not yet rendered
			store.state.val = 'new value' + Math.random();
			expect(wrapper.text()).not.toBe(store.state.val);

			// wait for rendering
			await wrapper.vm.$forceUpdate();

			// now it should be rendered
			expect(wrapper.text()).toBe(store.state.val);
		});

		it('should trigger a watcher according a getter change', async () => {
			const watcher = jest.fn();

			const store = createStore({
				state: {
					val: 'test-demo' + Math.random()
				},
				getters: {
					testGetter: (state) => state.val
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{val}}</div>',
					setup() {
						const {testGetter} = useGetters(['testGetter']);

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

			store.state.val = 'new value' + Math.random();

			// wait for rendering
			await wrapper.vm.$forceUpdate();

			expect(watcher).toBeCalledTimes(1);
		});
	});
});
