import {computed} from '@vue/composition-api';
import {computedGetter, getAction, getMutation, getStoreFromInstance, MapArgument, Mapper, useMapping} from './util';
import {Store} from 'vuex';

export type Nullish = null | undefined;

function computedState(store: any, namespace: string, prop: string) {
	return computed(() => store.state[namespace][prop])
}

export function useNamespacedState<T = any>(storeOrNamespace: Store<T> | string | Nullish, namespaceOrMap: string | MapArgument, map?: MapArgument): Mapper<any> {
	let store: Store<T>, namespace: string;

	if (arguments.length === 2) {
		store = getStoreFromInstance<T>();
		map = namespaceOrMap as MapArgument;
		namespace = storeOrNamespace as string;
	} else {
		store = storeOrNamespace as Store<T> || getStoreFromInstance<T>();
		namespace = namespaceOrMap as string;
	}
	return useMapping(store, namespace, map, computedState);
}

export function useNamespacedMutations<T = any>(storeOrNamespace: Store<T> | string | Nullish, namespaceOrMap: string | MapArgument, map?: MapArgument): Mapper<Function> {
	let store: Store<T>, namespace: string;

	if (arguments.length === 2) {
		store = getStoreFromInstance<T>();
		map = namespaceOrMap as MapArgument;
		namespace = storeOrNamespace as string;
	} else {
		store = storeOrNamespace as Store<T> || getStoreFromInstance<T>();
		namespace = namespaceOrMap as string;
	}
	return useMapping(store, namespace, map, getMutation);
}

export function useNamespacedActions<T = any>(storeOrNamespace: Store<T> | string | Nullish, namespaceOrMap: string | MapArgument, map?: MapArgument): Mapper<Function> {
	let store: Store<T>, namespace: string;

	if (arguments.length === 2) {
		store = getStoreFromInstance<T>();
		map = namespaceOrMap as MapArgument;
		namespace = storeOrNamespace as string;
	} else {
		store = storeOrNamespace as Store<T> || getStoreFromInstance<T>();
		namespace = namespaceOrMap as string;
	}
	return useMapping(store, namespace, map, getAction);
}

export function useNamespacedGetters<T = any>(storeOrNamespace: Store<T> | string | Nullish, namespaceOrMap: string | MapArgument, map?: MapArgument): Mapper<any> {
	let store: Store<T>, namespace: string;

	if (arguments.length === 2) {
		store = getStoreFromInstance<T>();
		map = namespaceOrMap as MapArgument;
		namespace = storeOrNamespace as string;
	} else {
		store = storeOrNamespace as Store<T> || getStoreFromInstance<T>();
		namespace = namespaceOrMap as string;
	}
	return useMapping(store, namespace, map, computedGetter);
}

export function createNamespacedHelpers<T = any>(storeOrNamespace: Store<T> | string, namespace?: string) {
	let store: Store<T> | Nullish = undefined;
	if (arguments.length === 1) {
		namespace = storeOrNamespace as string;
	} else {
		store = storeOrNamespace as Store<T>;
		if (!namespace) {
			throw new Error('Namespace is missing to provide namespaced helpers')
		}
	}
	return {
		useState: useNamespacedState.bind(null, store, namespace),
		useMutations: useNamespacedMutations.bind(null, store, namespace),
		useActions: useNamespacedActions.bind(null, store, namespace),
		useGetters: useNamespacedGetters.bind(null, store, namespace),
	}
}
