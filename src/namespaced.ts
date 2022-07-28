import {Store} from 'vuex';
import {computedGetter, getAction, getMutation, getStoreFromInstance, useMapping, KnownKeys, RefTypes, ExtractTypes, ExtractGetterTypes, Nullish} from './util';
import {useActions, useState, useGetters, useMutations} from './global'

export const useNamespacedActions = useActions
export const useNamespacedGetters = useGetters
export const useNamespacedMutations = useMutations
export const useNamespacedState = useState

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
		useState: (map?: KnownKeys<TState>[]) => useState(store, namespace as string, map),
		useGetters: (map?: KnownKeys<TGetters>[]) => useGetters(store, namespace as string, map),
		useMutations: (map?: KnownKeys<TMutations>[]) => useMutations(store, namespace as string, map),
		useActions: (map?: KnownKeys<TActions>[]) => useActions(store, namespace as string, map),
	}
}
