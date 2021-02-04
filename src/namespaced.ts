import {computed} from 'vue';
import {computedGetter, getAction, getMutation, getStoreFromInstance, useMapping, KnownKeys, RefTypes, ExtractTypes, ExtractGetterTypes} from './util';
import {Store} from 'vuex';

export type Nullish = null | undefined;

function computedState(store: any, namespace: string, prop: string) {
	let module = namespace.split('/').reduce((module, key) => module[key], store.state)
	return computed(() => module[prop])
}

export function useNamespacedState<TState = any>(storeOrNamespace: Store<any> | string  | Nullish, namespaceOrMap: string | KnownKeys<TState>[], map?: KnownKeys<TState>[]): RefTypes<TState> {
	let store: Store<any>, namespace: string;

	if (arguments.length === 2) {
		store = getStoreFromInstance();
		map = namespaceOrMap as KnownKeys<TState>[];
		namespace = storeOrNamespace as string;
	} else {
		store = storeOrNamespace as Store<TState> || getStoreFromInstance();
		namespace = namespaceOrMap as string;
	}
	return useMapping(store, namespace, map, computedState);
}

export function useNamespacedMutations<TMutations = any>(storeOrNamespace: Store<any> | string | Nullish, namespaceOrMap: string | KnownKeys<TMutations>[], map?: KnownKeys<TMutations>[]): ExtractTypes<TMutations, Function> {
	let store: Store<any>, namespace: string;

	if (arguments.length === 2) {
		store = getStoreFromInstance();
		map = namespaceOrMap as KnownKeys<TMutations>[];
		namespace = storeOrNamespace as string;
	} else {
		store = storeOrNamespace as Store<any> || getStoreFromInstance();
		namespace = namespaceOrMap as string;
	}
	return useMapping(store, namespace, map, getMutation);
}

export function useNamespacedActions<TActions = any>(storeOrNamespace: Store<any> | string | Nullish, namespaceOrMap: string | KnownKeys<TActions>[], map?: KnownKeys<TActions>[]): ExtractTypes<TActions, Function> {
	let store: Store<any>, namespace: string;

	if (arguments.length === 2) {
		store = getStoreFromInstance();
		map = namespaceOrMap as KnownKeys<TActions>[];
		namespace = storeOrNamespace as string;
	} else {
		store = storeOrNamespace as Store<any> || getStoreFromInstance();
		namespace = namespaceOrMap as string;
	}
	return useMapping(store, namespace, map, getAction);
}

export function useNamespacedGetters<TGetters = any>(storeOrNamespace: Store<any> | string | Nullish, namespaceOrMap: string | KnownKeys<TGetters>[], map?: KnownKeys<TGetters>[]): ExtractGetterTypes<TGetters> {
	let store: Store<any>, namespace: string;

	if (arguments.length === 2) {
		store = getStoreFromInstance();
		map = namespaceOrMap as KnownKeys<TGetters>[];
		namespace = storeOrNamespace as string;
	} else {
		store = storeOrNamespace as Store<any> || getStoreFromInstance();
		namespace = namespaceOrMap as string;
	}
	return useMapping(store, namespace, map, computedGetter);
}

export function createNamespacedHelpers<TState = any, TGetters = any, TActions = any, TMutations = any>(storeOrNamespace: Store<any> | string, namespace?: string):{
	useState: (map?: KnownKeys<TState>[]) => RefTypes<TState>;
	useGetters: (map?: KnownKeys<TGetters>[]) => ExtractGetterTypes<TGetters>;
	useMutations: (map?: KnownKeys<TMutations>[]) => ExtractTypes<TMutations, Function>;
	useActions: (map?: KnownKeys<TActions>[]) => ExtractTypes<TActions, Function>;
} {
	let store: Store<any> | Nullish = undefined;
	if (arguments.length === 1) {
		namespace = storeOrNamespace as string;
	} else {
		store = storeOrNamespace as Store<any>;
		if (!namespace) {
			throw new Error('Namespace is missing to provide namespaced helpers')
		}
	}
	return {
		useState: (map?: KnownKeys<TState>[]) => useNamespacedState(store, namespace as string, map),
		useGetters: (map?: KnownKeys<TGetters>[]) => useNamespacedGetters(store, namespace as string, map),
		useMutations: (map?: KnownKeys<TMutations>[]) => useNamespacedMutations(store, namespace as string, map),
		useActions: (map?: KnownKeys<TActions>[]) => useNamespacedActions(store, namespace as string, map),
	}
}
