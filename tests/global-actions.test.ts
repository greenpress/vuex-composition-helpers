import Vue from 'vue';
import Vuex, {ActionTree, Module} from 'vuex';
import {shallowMount} from '@vue/test-utils';

import {getLocalVue} from './utils/local-vue';
import {useActions} from '../src/global';

describe('"useActions" - global store actions helpers', () => {
	let localVue: typeof Vue;

	beforeEach(() => {
		localVue = getLocalVue();
	});

	describe('when given store and map', () => {
		it('should dispatch action with given payload', () => {
			const clickValue = 'demo-click-' + Math.random();
			const dispatcher = jest.fn();
			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				},
				actions: {
					doTest: ({state}, payload) => {
						dispatcher(state, payload);
					}
				}
			});

			const wrapper = shallowMount({
					template: '<div @click="doTest(\'' + clickValue + '\')">click</div>',
					setup() {
						const {doTest} = useActions(store, ['doTest']);
						return {
							doTest
						}
					}
				},
				{localVue}
			);

			expect(dispatcher).not.toBeCalled();

			wrapper.find('div').trigger('click');

			expect(dispatcher).toBeCalledTimes(1);
			expect(dispatcher).toBeCalledWith(store.state, clickValue);
		});
	});

	describe('when given map only', () => {
		it('should dispatch action with given payload', () => {
			const clickValue = 'demo-click-' + Math.random();
			const dispatcher = jest.fn();
			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				},
				actions: {
					doTest: ({state}, payload) => {
						dispatcher(state, payload);
					}
				}
			});

			const wrapper = shallowMount({
					template: '<div @click="doTest(\'' + clickValue + '\')">click</div>',
					setup() {
						const {doTest} = useActions(['doTest']);
						return {
							doTest
						}
					}
				},
				{localVue, store}
			);

			expect(dispatcher).not.toBeCalled();

			wrapper.find('div').trigger('click');

			expect(dispatcher).toBeCalledTimes(1);
			expect(dispatcher).toBeCalledWith(store.state, clickValue);
		});

		it('should dispatch a typed action with given payload', () => {
			const clickValue = 'demo-click-' + Math.random();
			const dispatcher = jest.fn();

			interface Actions extends ActionTree<any, any> {
				doTest: (ctx: any, payload: string) => void
			}

			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				},
				actions: {
					doTest: ({state}, payload) => {
						dispatcher(state, payload);
					}
				}
			});

			const wrapper = shallowMount({
					template: '<div @click="onClicked">click</div>',
					setup() {
						const {doTest} = useActions<Actions>(['doTest']);
						const onClicked = () => doTest(clickValue);
						return {
							onClicked,
							doTest
						}
					}
				},
				{localVue, store}
			);

			expect(dispatcher).not.toBeCalled();

			wrapper.find('div').trigger('click');

			expect(dispatcher).toBeCalledTimes(1);
			expect(dispatcher).toBeCalledWith(store.state, clickValue);
		});

		it('should dispatch a typed async action with given payload', async () => {
			const clickValue = 'demo-click-' + Math.random();
			const dispatcher = jest.fn();

			interface Actions {
				doTest: (ctx: any, payload: string) => Promise<void>
			}

			const store = new Vuex.Store({
				state: {
					val: 'test-demo' + Math.random()
				},
				actions: {
					doTest: async ({state}, payload) => {
						await new Promise(resolve => setTimeout(resolve));
						dispatcher(state, payload);
					}
				}
			});

			const wrapper = shallowMount({
					template: '<div></div>',
					setup() {
						const {doTest} = useActions<Actions>(['doTest']);
						const onClicked = async () => await doTest(clickValue);
						return {
							onClicked,
							doTest
						}
					}
				},
				{localVue, store}
			);

			expect(dispatcher).not.toBeCalled();

			await (wrapper.vm as any).onClicked();
			await wrapper.vm.$nextTick();

			expect(dispatcher).toBeCalledTimes(1);
			expect(dispatcher).toBeCalledWith(store.state, clickValue);
		});
	});
	
	describe('when given namespace and map', () => {
		it('should dispatch action with given payload', () => {
			const clickValue = 'demo-click-' + Math.random();
			const dispatcher = jest.fn();
			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				},
				actions: {
					doTest: ({state}, payload) => {
						dispatcher(state, payload);
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
						const {doTest} = useActions('foo', ['doTest']);
						return {
							doTest
						}
					}
				},
				{localVue, store}
			);

			expect(dispatcher).not.toBeCalled();

			wrapper.find('div').trigger('click');

			expect(dispatcher).toBeCalledTimes(1);
			expect(dispatcher).toBeCalledWith(storeModule.state, clickValue);
		});

		it('should dispatch a typed action with given payload', () => {
			const clickValue = 'demo-click-' + Math.random();
			const dispatcher = jest.fn();

			interface Actions {
				doTest: (ctx: any, payload: string) => void
			}

			const storeModule: Module<any, any> = {
				namespaced: true,
				state: {
					val: 'test-demo' + Math.random()
				},
				actions: {
					doTest: ({state}, payload) => {
						dispatcher(state, payload);
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
					template: '<div @click="onClicked">click</div>',
					setup() {
						const {doTest} = useActions<Actions>('foo', ['doTest']);
						const onClicked = () => doTest(clickValue);
						return {
							onClicked,
							doTest
						}
					}
				},
				{localVue, store}
			);

			expect(dispatcher).not.toBeCalled();

			wrapper.find('div').trigger('click');

			expect(dispatcher).toBeCalledTimes(1);
			expect(dispatcher).toBeCalledWith(storeModule.state, clickValue);
		});
	});

});
