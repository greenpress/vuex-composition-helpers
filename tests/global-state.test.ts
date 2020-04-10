import Vue from 'vue';
import Vuex from 'vuex';
import {shallowMount} from '@vue/test-utils';

import {getLocalVue} from './utils/local-vue';
import {useState} from '../src/global';
import {watch} from '@vue/composition-api';

describe('global store helpers', () => {
	let localVue: typeof Vue;

	beforeEach(() => {
		localVue = getLocalVue();
	});

	it('should render component using a state value', () => {
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
			{localVue}
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

					watch(val, watcher);

					return {
						stateVal: val
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
