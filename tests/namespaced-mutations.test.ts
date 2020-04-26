import Vue from 'vue';
import Vuex, {Module} from 'vuex';
import {shallowMount} from '@vue/test-utils';

import {getLocalVue} from './utils/local-vue';
import {useNamespacedMutations} from '../src/namespaced';

describe('"useNamespacedMutations" - namespaced store mutations helpers', () => {
	let localVue: typeof Vue;

	beforeEach(() => {
		localVue = getLocalVue();
	});

	describe('when given store in arguments', () => {
		it('should commit mutation with given payload', () => {
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
			const store = new Vuex.Store<any>({
				state: {},
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div @click="doTest(\'' + clickValue + '\')">click</div>',
					setup() {
						const {doTest} = useNamespacedMutations(store, 'foo', ['doTest']);
						return {
							doTest
						}
					}
				},
				{localVue}
			);

			expect(mutate).not.toBeCalled();

			wrapper.find('div').trigger('click');

			expect(mutate).toBeCalledTimes(1);
			expect(mutate).toBeCalledWith(clickValue);
		});
	});

	describe('when given store in argument is undefined', () => {
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
						const {doTest} = useNamespacedMutations(undefined, 'foo', ['doTest']);
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
	});

	describe('when store not given in arguments', () => {
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
						const {doTest} = useNamespacedMutations('foo', ['doTest']);
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
						const {doTest} = useNamespacedMutations<Mutations>('foo', ['doTest']);
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
