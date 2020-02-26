import {computed} from '@vue/composition-api';
import {computedGetter, getAction, getMutation, Mapper, useMapping} from './util';

function computedState(store, namespace: string, prop: string) {
	return computed(() => store.state[namespace][prop])
}

export function useNamespacedState(store, namespace: string, map: Mapper | Array<string>): { [key: string]: any } {
	return useMapping(store, null, map, computedState);
}

export function useNamespacedMutations(store, namespace: string, map: Mapper | Array<string>) {
	return useMapping(store, namespace, map, getMutation);
}

export function useNamespacedActions(store, namespace: string, map: Mapper | Array<string>) {
	return useMapping(store, namespace, map, getAction);
}

export function useNamespacedGetters(store, namespace: string, map: Mapper | Array<string>): { [key: string]: any } {
	return useMapping(store, namespace, map, computedGetter);
}

export function createNamespacedHelpers(store, namespace) {
	return {
		useState: useNamespacedState.bind(null, [store, namespace]),
		useMutations: useNamespacedMutations.bind(null, [store, namespace]),
		useActions: useNamespacedActions.bind(null, [store, namespace]),
		useGetters: useNamespacedGetters.bind(null, [store, namespace]),
	}
}
