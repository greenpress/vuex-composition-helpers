import {computed} from '@vue/composition-api';
import {computedGetter, getAction, getMutation, Mapper, useMapping} from './util';

function computedState(store: any, namespace: string, prop: string) {
	return computed(() => store.state[namespace][prop])
}

export function useNamespacedState(store: any, namespace: string, map: Mapper | Array<string>): Mapper<any> {
	return useMapping(store, namespace, map, computedState);
}

export function useNamespacedMutations(store: any, namespace: string, map: Mapper | Array<string>): Mapper<Function> {
	return useMapping(store, namespace, map, getMutation);
}

export function useNamespacedActions(store: any, namespace: string, map: Mapper | Array<string>): Mapper<Function> {
	return useMapping(store, namespace, map, getAction);
}

export function useNamespacedGetters(store: any, namespace: string, map: Mapper | Array<string>): Mapper<any> {
	return useMapping(store, namespace, map, computedGetter);
}

export function createNamespacedHelpers(store: any, namespace: string) {
	return {
		useState: useNamespacedState.bind(null, store, namespace),
		useMutations: useNamespacedMutations.bind(null, store, namespace),
		useActions: useNamespacedActions.bind(null, store, namespace),
		useGetters: useNamespacedGetters.bind(null, store, namespace),
	}
}
