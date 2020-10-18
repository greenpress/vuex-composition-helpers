import Vuex, {Module} from 'vuex';
import {shallowMount} from '@vue/test-utils';

import {useNamespacedActions} from '../src/namespaced';

describe('"useNamespacedActions" - namespaced store actions helpers', () => {
	describe('when given store in arguments', () => {
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
			const store = new Vuex.Store<any>({
				state: {},
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div @click="doTest(\'' + clickValue + '\')">click</div>',
					setup() {
						const {doTest} = useNamespacedActions(store, 'foo', ['doTest']);
						return {
							doTest
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
			);

			expect(dispatcher).not.toBeCalled();

			wrapper.find('div').trigger('click');

			expect(dispatcher).toBeCalledTimes(1);
			expect(dispatcher).toBeCalledWith(storeModule.state, clickValue);
		});
	});

	describe('when given store in argument is undefined', () => {
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
			const store = new Vuex.Store<any>({
				state: {},
				modules: {
					foo: storeModule
				}
			});

			const wrapper = shallowMount({
					template: '<div @click="doTest(\'' + clickValue + '\')">click</div>',
					setup() {
						const {doTest} = useNamespacedActions(undefined, 'foo', ['doTest']);
						return {
							doTest
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
			);

			expect(dispatcher).not.toBeCalled();

			wrapper.find('div').trigger('click');

			expect(dispatcher).toBeCalledTimes(1);
			expect(dispatcher).toBeCalledWith(storeModule.state, clickValue);
		});
	});

	describe('when store not given in arguments', () => {
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
						const {doTest} = useNamespacedActions('foo', ['doTest']);
						return {
							doTest
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
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
						const {doTest} = useNamespacedActions<Actions>('foo', ['doTest']);
						const onClicked = () => doTest(clickValue);
						return {
							onClicked,
							doTest
						}
					}
				},
				{
					global: {
						plugins: [store]
					}
				}
			);

			expect(dispatcher).not.toBeCalled();

			wrapper.find('div').trigger('click');

			expect(dispatcher).toBeCalledTimes(1);
			expect(dispatcher).toBeCalledWith(storeModule.state, clickValue);
		});
	});

});
