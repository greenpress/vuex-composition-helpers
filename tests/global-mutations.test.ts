import Vuex, { MutationTree } from 'vuex';
import {shallowMount} from '@vue/test-utils';

import {useMutations} from '../src/global';

describe('"useMutations" - global store mutations helpers', () => {
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
				{
					global: {
						plugins: [store]
					}
				}
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
				{
					global: {
						plugins: [store]
					}
				}
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
				{
					global: {
						plugins: [store]
					}
				}
			);

			expect(mutate).not.toBeCalled();

			wrapper.find('div').trigger('click');

			expect(mutate).toBeCalledTimes(1);
			expect(mutate).toBeCalledWith(clickValue);
			expect(store.state.val).toBe(clickValue);
		});
	})

});
