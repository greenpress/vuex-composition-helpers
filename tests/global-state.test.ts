import {watch} from 'vue';
import {createStore} from 'vuex';
import {shallowMount} from '@vue/test-utils';

import {useState} from '../src/global';

describe('"useState" - global store state helpers', () => {
	describe('when given both store and map', () => {

		it('should render component using a state value', () => {
			const store = createStore({
				state: {
					val: 'test-demo' + Math.random()
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useState(store, ['val']);
						return {
							stateVal: val
						}
					}
				}
			);

			expect(wrapper.text()).toBe(store.state.val);
		});

		it('should render component using a typed state value', () => {
			interface RootState {
				val: string;
				num: number;
			}

			const store = createStore<RootState>({
				state: {
					val: 'test-demo' + Math.random(),
					num: 3
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useState<RootState>(store, ['val']);
						return {
							stateVal: val
						}
					}
				}
			);

			expect(wrapper.text()).toBe(store.state.val);
		});

		it('should change component contents according a state change', async () => {
			const store = createStore({
				state: {
					val: 'test-demo' + Math.random()
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useState(store, ['val']);
						return {
							stateVal: val
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


		it('should not be able to mutate state directly and trigger a warning', async () => {
			const store = createStore({
				state: {
					val: 'original-value'
				}
			});

			const {val} = useState(store, ['val'])

			const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
			// @ts-ignore
			val.value = 'some-value'
			expect(console.warn).toHaveBeenLastCalledWith("Write operation failed: computed value is readonly");
			consoleWarnMock.mockRestore();

			expect(store.state.val).toBe('original-value');
		});

		it('should not be able to mutate state objects directly and trigger a warning', async () => {
			const store = createStore({
				state: {
					val: {
						nestedValue: {
							nestedValue2: 'original-value'
						}
					}
				}
			});

			const {val} = useState(store, ['val'])

			const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
			// @ts-ignore
			val.value.nestedValue.nestedValue2 = 'changed-value'
			expect(console.warn).toHaveBeenLastCalledWith("Set operation on key \"nestedValue2\" failed: target is readonly.", val.value.nestedValue);
			consoleWarnMock.mockRestore();

			expect(store.state.val.nestedValue.nestedValue2).toBe('original-value');
		});

		it('should trigger a watcher according a state change', async () => {
			const watcher = jest.fn();
			const store = createStore({
				state: {
					val: 'test-demo' + Math.random()
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useState(store, ['val']);

						watch(val, watcher);

						return {
							stateVal: val
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
	})

	describe('when given map only', () => {
		it('should render component using a state value', () => {
			const store = createStore({
				state: {
					val: 'test-demo' + Math.random()
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useState(['val']);
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

			expect(wrapper.text()).toBe(store.state.val);
		});

		it('should render component using a typed state value', () => {
			interface RootState {
				val: string,
			}

			const store = createStore({
				state: {
					val: 'test-demo' + Math.random()
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useState<RootState>(['val']);
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

			expect(wrapper.text()).toBe(store.state.val);
		});

		it('should change component contents according a state change', async () => {
			const store = createStore({
				state: {
					val: 'test-demo' + Math.random()
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useState(['val']);
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
			expect(wrapper.text()).toBe(store.state.val);

			// change value, but not yet rendered
			store.state.val = 'new value' + Math.random();
			expect(wrapper.text()).not.toBe(store.state.val);

			// wait for rendering
			await wrapper.vm.$forceUpdate();

			// now it should be rendered
			expect(wrapper.text()).toBe(store.state.val);
		});

		it('should trigger a watcher according a state change', async () => {
			const watcher = jest.fn();
			const store = createStore({
				state: {
					val: 'test-demo' + Math.random()
				}
			});

			const wrapper = shallowMount({
					props: {},
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useState(['val']);

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

			store.state.val = 'new value' + Math.random();

			// wait for rendering
			await wrapper.vm.$forceUpdate();

			expect(watcher).toBeCalledTimes(1);

		});
	})

});
