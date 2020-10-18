import Vuex from 'vuex';
import {shallowMount} from '@vue/test-utils';

import {useState} from '../src/global';
import {watch} from 'vue';

describe('"useState" - global store state helpers', () => {
	describe('when given both store and map', () => {
		it('should render component using a state value', () => {
			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{stateVal}}</div>',
				  props: [],
					setup() {
						const {val} = useState(store, ['val']);
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
				val: string;
				num: number;
			};
			const store = new Vuex.Store<RootState>({
				state: {
					val: 'test-demo' + Math.random(),
					num: 3
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useState<RootState>(store, ['val']);
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
			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useState(store, ['val']);
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
			await (wrapper.vm as any).$nextTick();

			// now it should be rendered
			expect(wrapper.text()).toBe(store.state.val);
		});

		it('should trigger a watcher according a state change', async () => {
			const watcher = jest.fn();
			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useState(store, ['val']);

						watch(val, watcher, {immediate: true});

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

			expect(watcher).toBeCalledTimes(1);

			store.state.val = 'new value' + Math.random();

			expect(watcher).toBeCalledTimes(1);

			// wait for rendering
			await (wrapper.vm as any).$nextTick();

			expect(watcher).toBeCalledTimes(2);

		});
	})

	describe('when given map only', () => {
		it('should render component using a state value', () => {
			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				}
			});

			const wrapper = shallowMount({
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
			};
			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				}
			});

			const wrapper = shallowMount({
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
			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				}
			});

			const wrapper = shallowMount({
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
			await (wrapper.vm as any).$nextTick();

			// now it should be rendered
			expect(wrapper.text()).toBe(store.state.val);
		});

		it('should trigger a watcher according a state change', async () => {
			const watcher = jest.fn();
			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				}
			});

			const wrapper = shallowMount({
					template: '<div>{{stateVal}}</div>',
					setup() {
						const {val} = useState( ['val']);

						watch(val, watcher, {immediate: true});

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

			expect(watcher).toBeCalledTimes(1);

			store.state.val = 'new value' + Math.random();

			expect(watcher).toBeCalledTimes(1);

			// wait for rendering
			await (wrapper.vm as any).$nextTick();

			expect(watcher).toBeCalledTimes(2);

		});
	})

});
