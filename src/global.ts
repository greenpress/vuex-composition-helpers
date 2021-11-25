import {Store} from 'vuex/types';
import {computed} from 'vue';
import {computedGetter, getAction, getMutation, getStoreFromInstance, useMapping, ExtractGetterTypes, ExtractTypes, KnownKeys, RefTypes} from './util';

function computedState(store: any, prop: string) {
	return computed(() => store.state[prop]);
}

export function useStore<TState = any>() {
	return getStoreFromInstance() as Store<TState>
}

export function useState<TState = any>(storeOrMap: Store<TState> | KnownKeys<TState>[], map?: KnownKeys<TState>[]): RefTypes<TState> {
	let store = storeOrMap;

	if (arguments.length === 1) {
		map = store as KnownKeys<TState>[];
		store = getStoreFromInstance();
	}
	return useMapping(store, null, map, computedState);
}

export function useGetters<TGetters = any>(storeOrMap: Store<any> | KnownKeys<TGetters>[], map?: KnownKeys<TGetters>[]): ExtractGetterTypes<TGetters> {
	let store = storeOrMap;
	if (arguments.length === 1) {
		map = store as KnownKeys<TGetters>[];
		store = getStoreFromInstance();
	}
	return useMapping(store, null, map, computedGetter);
}

export function useMutations<TMutations = any>(storeOrMap: Store<any> | KnownKeys<TMutations>[], map?: KnownKeys<TMutations>[]): ExtractTypes<TMutations, Function> {
	let store = storeOrMap;

	if (arguments.length === 1) {
		map = store as KnownKeys<TMutations>[];
		store = getStoreFromInstance();
	}
	return useMapping(store, null, map, getMutation);
}

export function useActions<TActions = any>(storeOrMap: Store<any> | KnownKeys<TActions>[], map?: KnownKeys<TActions>[]): ExtractTypes<TActions, Function> {
	let store = storeOrMap;

	if (arguments.length === 1) {
		map = store as KnownKeys<TActions>[];
		store = getStoreFromInstance();
	}
	return useMapping(store, null, map, getAction);
}
