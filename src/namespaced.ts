import {computed} from '@vue/composition-api';
import {Store} from 'vuex/types';
import {computedGetter, getAction, getMutation, getStoreFromInstance, useMapping, KnownKeys, RefTypes, ExtractTypes, ExtractGetterTypes} from './util';

export type Nullish = null | undefined;

/**
 * Gets a computed observable for the vuex state.
 * @param store The store to get the state from
 * @param namespace The namespace to get the sate from
 * @param prop The state prop to get
 * @returns A computed observable from vuex state
 */
function computedState(store: Store<any>, namespace: string, prop: string) {
	const module = namespace.split('/').reduce((module, key) => module[key], store.state)
	return computed(() => module[prop])
}

/**
 * Get the state of the module at the provided namespace.
 *
 * Injects the vuex store from the root vue instance.
 * @param namespace The namespace to get this state from
 * @param map An array of known State keys for this modules namespace
 *
 * @example
 * const { foo, bar } = useNamespacedState('moduleNamespace', ['foo', 'bar']);
 */
export function useNamespacedState<TState = any>(namespace: string, map: KnownKeys<TState>[]): RefTypes<TState>
/**
 * Get the state of the module at the provided namespace, from the provided store.
 * @param store An instance of the vuex store to get the state from
 * @param namespace The namespace to get this state from
 * @param keys An array of known State keys for this modules namespace
 *
 * @example
 * const { foo, bar } = useNamespacedState(store, 'moduleNamespace', ['foo', 'bar']);
 */
export function useNamespacedState<TState = any>(store: Store<any> | Nullish, namespace: string, map: KnownKeys<TState>[]): RefTypes<TState>
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

/**
 * Retrieves mutations from of the module at the provided namespace.
 *
 * Injects the vuex store from the root vue instance.
 * @param namespace The namespace to get mutations from
 * @param map An array of known mutation keys from this modules namespace
 *
 * @example
 * const { setFoo, setBar } = useNamespacedMutations('moduleNamespace', ['setFoo', 'setBar']);
 */
export function useNamespacedMutations<TMutations = any>(namespace: string, map: KnownKeys<TMutations>[]): ExtractTypes<TMutations, Function>
/**
 * Retrieves mutations from of the module at the provided namespace, from the provided store.
 * @param store An instance of the vuex store to get mutations from
 * @param namespace The namespace to get mutations from
 * @param keys An array of known mutation keys from this modules namespace
 *
 * @example
 * const { setFoo, setBar } = useNamespacedMutations(store, 'moduleNamespace', ['setFoo', 'setBar']);
 */
export function useNamespacedMutations<TMutations = any>(store: Store<any> | Nullish, namespace: string, map: KnownKeys<TMutations>[]): ExtractTypes<TMutations, Function>
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

/**
 * Retrieves actions from the module at the provided namespace.
 *
 * Injects the vuex store from the root vue instance.
 * @param namespace The namespace to get actions from
 * @param map An array of known action keys for this modules namespace
 *
 * @example
 * const { doFoo, doBar } = useNamespacedActions('moduleNamespace', ['doFoo', 'doBar']);
 */
export function useNamespacedActions<TActions = any>(namespace: string, map:  KnownKeys<TActions>[]): ExtractTypes<TActions, Function>
/**
 * Retrieves actions from the module at the provided namespace, from the provided store.
 * @param store An instance of the vuex store to get actions from
 * @param namespace The namespace to get actions from
 * @param keys An array of known action keys for this modules namespace
 *
 * @example
 * const { doFoo, doBar } = useNamespacedActions(store, 'moduleNamespace', ['doFoo', 'doBar']);
 */
export function useNamespacedActions<TActions = any>(store: Store<any> | Nullish, namespace: string, map: KnownKeys<TActions>[]): ExtractTypes<TActions, Function>
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

/**
 * Retrieves getters from the module at the provided namespace.
 *
 * Injects the vuex store from the root vue instance.
 * @param namespace The namespace to retrieve getters from
 * @param map An array of known getter keys for this modules namespace
 *
 * @example
 * const { getFoo, getBar } = useNamespacedGetters('moduleNamespace', ['getFoo', 'getBar']);
 */
export function useNamespacedGetters<TGetters = any>(namespace: string, map: KnownKeys<TGetters>[]): ExtractGetterTypes<TGetters>
/**
 * Retrieves getters from the module at the provided namespace, from the provided store.
 * @param store An instance of the vuex store to retrieve getters from
 * @param namespace The namespace to retrieve getters from
 * @param keys An array of known getter keys for this modules namespace
 *
 * @example
 * const { getFoo, getBar } = useNamespacedGetters(store, 'moduleNamespace', ['getFoo', 'getBar']);
 */
export function useNamespacedGetters<TGetters = any>(store: Store<any> | Nullish, namespace: string , map: KnownKeys<TGetters>[]): ExtractGetterTypes<TGetters>
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

export type NamespacedUseState<TState> = (map: KnownKeys<TState>[]) => RefTypes<TState>;
export type NamespacedUseGetter<TGetters> = (map: KnownKeys<TGetters>[]) => ExtractGetterTypes<TGetters>;
export type NamespacedUseMutations<TMutations> = (map: KnownKeys<TMutations>[]) => ExtractTypes<TMutations, Function>;
export type NamespacedUseActions<TActions> = (map: KnownKeys<TActions>[]) => ExtractTypes<TActions, Function>;

export type NamespacedHelpers<TState = any, TGetters = any, TActions = any, TMutations = any> = {
	useState: NamespacedUseState<TState>;
	useGetters: NamespacedUseGetter<TGetters>;
	useMutations: NamespacedUseMutations<TMutations>;
	useActions: NamespacedUseActions<TActions>;
}

/**
 * Creates namespaced helpers for a vuex module.
 *
 * Injects the vuex store from the root vue instance.
 * @param namespace The namespace to create helpers for
 *
 * @example
 * const { useState, useGetters, useMutations, useAction } = createNamespacedHelpers('foobar');
 * const { foo, bar } = useState(['foo', 'bar']);
 */
export function createNamespacedHelpers<TState = any, TGetters = any, TActions = any, TMutations = any>(namespace: string): NamespacedHelpers<TState, TGetters, TActions, TMutations>
/**
 * Creates namespaced helpers for a vuex module in the provided store.
 * @param store The store to create namespaced helpers for
 * @param namespace The namespace to create helpers for
 *
 * @example
 * const { useState, useGetters, useMutations, useAction } = createNamespacedHelpers(store, 'foobar');
 * const { foo, bar } = useState(['foo', 'bar']);
 */
export function createNamespacedHelpers<TState = any, TGetters = any, TActions = any, TMutations = any>(store: Store<any>, namespace: string): NamespacedHelpers<TState, TGetters, TActions, TMutations>
export function createNamespacedHelpers<TState = any, TGetters = any, TActions = any, TMutations = any>(storeOrNamespace: Store<any> | string, namespace?: string): NamespacedHelpers<TState, TGetters, TActions, TMutations> {
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
		useState: (map: KnownKeys<TState>[]) => useNamespacedState(store, namespace as string, map),
		useGetters: (map: KnownKeys<TGetters>[]) => useNamespacedGetters(store, namespace as string, map),
		useMutations: (map: KnownKeys<TMutations>[]) => useNamespacedMutations(store, namespace as string, map),
		useActions: (map: KnownKeys<TActions>[]) => useNamespacedActions(store, namespace as string, map),
	}
}
