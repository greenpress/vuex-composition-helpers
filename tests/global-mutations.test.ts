import Vue from 'vue';
import Vuex, {Module, MutationTree} from 'vuex';
import {shallowMount} from '@vue/test-utils';

import {getLocalVue} from './utils/local-vue';
import {useMutations} from '../src/global';

describe('"useMutations" - global store mutations helpers', () => {
	let localVue: typeof Vue;

	beforeEach(() => {
		localVue = getLocalVue();
	});

	describe('when given both store and map', () => {
		it('should commit mutation with given payload', () => {
			const clickValue = 'demo-click-' + Math.random();
			const mutate = jest.fn();
			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				},
				mutations: {
					change: (state, payload) => {
						state.val = payload;
						mutate(payload);
					}
				}
			});

			const wrapper = shallowMount({
					template: '<div @click="change(\'' + clickValue + '\')">click</div>',
					setup() {
						const {change} = useMutations(store, ['change']);
						return {
							change
						}
					}
				},
				{localVue}
			);

			expect(mutate).not.toBeCalled();

			wrapper.find('div').trigger('click');

			expect(mutate).toBeCalledTimes(1);
			expect(mutate).toBeCalledWith(clickValue);
			expect(store.state.val).toBe(clickValue);
		});
	});

	describe('when given map only', () => {
		it('should commit mutation with given payload', () => {
			const clickValue = 'demo-click-' + Math.random();
			const mutate = jest.fn();
			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				},
				mutations: {
					change: (state, payload) => {
						state.val = payload;
						mutate(payload);
					}
				}
			});

			const wrapper = shallowMount({
					template: '<div @click="change(\'' + clickValue + '\')">click</div>',
					setup() {
						const {change} = useMutations(['change']);
						return {
							change
						}
					}
				},
				{localVue, store}
			);

			expect(mutate).not.toBeCalled();

			wrapper.find('div').trigger('click');

			expect(mutate).toBeCalledTimes(1);
			expect(mutate).toBeCalledWith(clickValue);
			expect(store.state.val).toBe(clickValue);
		});

		it('should commit a typed mutation with given payload', () => {
			const clickValue = 'demo-click-' + Math.random();
			const mutate = jest.fn();

			interface Mutations extends MutationTree<any> {
				change: (state: any, payload: string) => void;
			}

			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				},
				mutations: {
					change: (state, payload) => {
						state.val = payload;
						mutate(payload);
					}
				}
			});

			const wrapper = shallowMount({
					template: `<div @click="onClicked">click</div>`,
					setup() {
						const {change} = useMutations<Mutations>(['change']);
						const onClicked = () => change(clickValue);

						return {
							onClicked,
							change
						}
					}
				},
				{localVue, store}
			);

			expect(mutate).not.toBeCalled();

			wrapper.find('div').trigger('click');

			expect(mutate).toBeCalledTimes(1);
			expect(mutate).toBeCalledWith(clickValue);
			expect(store.state.val).toBe(clickValue);
		});
	});

	describe('when given namespace and map', () => {
		it('should dispatch action with given payload', () => {
			const clickValue = 'demo-click-' + Math.random();
			const mutate = jest.fn();
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				},
				mutations: {
					doTest: (state, payload) => {
						state.val = payload;
						mutate(payload);
					}
				}
			};
			const store = new Vuex.Store({
				state: {},
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div @click="doTest(\'' + clickValue + '\')">click</div>',
					setup() {
						const {doTest} = useMutations('foo', ['doTest']);
						return {
							doTest
						}
					}
				},
				{localVue, store}
			);

			expect(mutate).not.toBeCalled();

			wrapper.find('div').trigger('click');

			expect(mutate).toBeCalledTimes(1);
			expect(mutate).toBeCalledWith(clickValue);
		});

		it('should dispatch action with given payload', () => {
			const clickValue = 'demo-click-' + Math.random();
			const mutate = jest.fn();
			interface Mutations {
				doTest: (state: any, payload: string) => void;
			}
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				},
				mutations: {
					doTest: (state, payload) => {
						state.val = payload;
						mutate(payload);
					}
				}
			};
			const store = new Vuex.Store({
				state: {},
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: `<div @click="onClicked">click</div>`,
					setup() {
						const {doTest} = useMutations<Mutations>('foo', ['doTest']);
						const onClicked = () => doTest(clickValue);
						return {
							onClicked,
							doTest
						}
					}
				},
				{localVue, store}
			);

			expect(mutate).not.toBeCalled();

			wrapper.find('div').trigger('click');

			expect(mutate).toBeCalledTimes(1);
			expect(mutate).toBeCalledWith(clickValue);
		});
	});

});
