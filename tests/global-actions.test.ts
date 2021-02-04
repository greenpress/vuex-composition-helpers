import {ActionTree, createStore} from 'vuex';
import {shallowMount} from '@vue/test-utils';

import {useActions} from '../src/global';

describe('"useActions" - global store actions helpers', () => {

	describe('when given both store and map', () => {
		it('should dispatch action with given payload', () => {
			const clickValue = 'demo-click-' + Math.random();
			const dispatcher = jest.fn();
			const store = createStore({
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
					props: {},
					template: '<div @click="doTest(\'' + clickValue + '\')">click</div>',
					setup() {
						const {doTest} = useActions(store, ['doTest']);
						return {
							doTest
						}
					}
				}
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
			const store = createStore({
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
					props: {},
					template: '<div @click="doTest(\'' + clickValue + '\')">click</div>',
					setup() {
						const {doTest} = useActions(['doTest']);
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
			expect(dispatcher).toBeCalledWith(store.state, clickValue);
		});

		it('should dispatch a typed action with given payload', () => {
			const clickValue = 'demo-click-' + Math.random();
			const dispatcher = jest.fn();

			interface Actions extends ActionTree<any, any> {
				doTest: (ctx: any, payload: string) => void
			}

			const store = createStore({
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
					props: {},
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
				{
					global: {
						plugins: [store]
					}
				}
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

			const store = createStore({
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
					props: {},
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
				{
					global: {
						plugins: [store]
					}
				}
			);

			expect(dispatcher).not.toBeCalled();

			await (wrapper.vm as any).onClicked();
			await wrapper.vm.$forceUpdate();

			expect(dispatcher).toBeCalledTimes(1);
			expect(dispatcher).toBeCalledWith(store.state, clickValue);
		});
	})

});
