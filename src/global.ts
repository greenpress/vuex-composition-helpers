import {readonly} from 'vue';
import {Store} from 'vuex/types';
import {computed} from '@vue/composition-api';
import {computedGetter, getAction, getMutation, getStoreFromInstance, useMapping, ExtractGetterTypes, ExtractTypes, KnownKeys, RefTypes, Namespace, Nullish} from './util';

function computedState(store: any, prop: string) {
	return computed(() => readonly(store.state[prop]));
}

function computedNamespacedState(store: any, namespace: string, prop: string) {
	let module = namespace.split('/').reduce((module, key) => module[key], store.state) 
	return computed(() => readonly(module[prop]))
}

export function useStore<TState = any>() {
	return getStoreFromInstance() as Store<TState>
}

export function useState<TState = any>(map: KnownKeys<TState>[]): RefTypes<TState>;
export function useState<TState = any>(storeOrNamespace: Store<any> | Namespace, map?: KnownKeys<TState>[]): RefTypes<TState>;
export function useState<TState = any>(store: Store<any> | Nullish, namespace?: Namespace, map?: KnownKeys<TState>[]): RefTypes<TState>;
export function useState<TState = any>(storeOrNamespace: KnownKeys<TState>[] | Store<any> | Namespace, namespaceOrMap?: KnownKeys<TState>[] | Namespace, map?: KnownKeys<TState>[]): RefTypes<TState> {
	let realStore, realNamespace, realMap;
	if (arguments.length >= 3) {
		realStore = storeOrNamespace as Store<any> || getStoreFromInstance();
		realNamespace = namespaceOrMap as string || null;
		realMap = map as KnownKeys<TState>[] || null;
	} else if (arguments.length === 2) {
		if (typeof storeOrNamespace === 'string') {
			realStore = getStoreFromInstance();
			realNamespace = storeOrNamespace as string || null;
		} else {
			realStore = storeOrNamespace as Store<any> || getStoreFromInstance();
			realNamespace = null
		}
		realMap = namespaceOrMap as KnownKeys<TState>[] || null;
	} else {
		realStore = getStoreFromInstance();
		realNamespace = null;
		realMap = storeOrNamespace as KnownKeys<TState>[] || null;
	}
	return useMapping(realStore, realNamespace, realMap, !realNamespace ? computedState : computedNamespacedState);
}

export function useGetters<TGetters = any>(map: KnownKeys<TGetters>[]): ExtractGetterTypes<TGetters>;
export function useGetters<TGetters = any>(storeOrNamespace: Store<any> | Namespace, map?: KnownKeys<TGetters>[]): ExtractGetterTypes<TGetters>;
export function useGetters<TGetters = any>(store: Store<any> | Nullish, namespace?: Namespace, map?: KnownKeys<TGetters>[]): ExtractGetterTypes<TGetters>;
export function useGetters<TGetters = any>(storeOrNamespace: KnownKeys<TGetters>[] | Store<any> | Namespace, namespaceOrMap?: KnownKeys<TGetters>[] | Namespace, map?: KnownKeys<TGetters>[]): ExtractGetterTypes<TGetters> {
	let realStore, realNamespace, realMap;
	if (arguments.length >= 3) {
		realStore = storeOrNamespace as Store<any> || getStoreFromInstance();
		realNamespace = namespaceOrMap as string || null;
		realMap = map as KnownKeys<TGetters>[] || null;
	} else if (arguments.length === 2) {
		if (typeof storeOrNamespace === 'string') {
			realStore = getStoreFromInstance();
			realNamespace = storeOrNamespace as string || null;
		} else {
			realStore = storeOrNamespace as Store<any> || getStoreFromInstance();
			realNamespace = null
		}
		realMap = namespaceOrMap as KnownKeys<TGetters>[] || null;
	} else {
		realStore = getStoreFromInstance();
		realNamespace = null;
		realMap = storeOrNamespace as KnownKeys<TGetters>[] || null;
	}
	return useMapping(realStore, realNamespace, realMap, computedGetter);
}

export function useMutations<TMutations = any>(map: KnownKeys<TMutations>[]): ExtractTypes<TMutations, Function>;
export function useMutations<TMutations = any>(storeOrNamespace: Store<any> | Namespace, map?: KnownKeys<TMutations>[]): ExtractTypes<TMutations, Function>;
export function useMutations<TMutations = any>(store: Store<any> | Nullish, namespace?: Namespace, map?: KnownKeys<TMutations>[]): ExtractTypes<TMutations, Function>;
export function useMutations<TMutations = any>(storeOrNamespace: KnownKeys<TMutations>[] | Store<any> | Namespace, namespaceOrMap?: KnownKeys<TMutations>[] | Namespace, map?: KnownKeys<TMutations>[]): ExtractTypes<TMutations, Function> {
	let realStore, realNamespace, realMap;
	if (arguments.length >= 3) {
		realStore = storeOrNamespace as Store<any> || getStoreFromInstance();
		realNamespace = namespaceOrMap as string || null;
		realMap = map as KnownKeys<TMutations>[] || null;
	} else if (arguments.length === 2) {
		if (typeof storeOrNamespace === 'string') {
			realStore = getStoreFromInstance();
			realNamespace = storeOrNamespace as string || null;
		} else {
			realStore = storeOrNamespace as Store<any> || getStoreFromInstance();
			realNamespace = null
		}
		realMap = namespaceOrMap as KnownKeys<TMutations>[] || null;
	} else {
		realStore = getStoreFromInstance();
		realNamespace = null;
		realMap = storeOrNamespace as KnownKeys<TMutations>[] || null;
	}
	return useMapping(realStore, realNamespace, realMap, getMutation);
}

export function useActions<TActions = any>(map: KnownKeys<TActions>[]): ExtractTypes<TActions, Function>;
export function useActions<TActions = any>(storeOrNamespace: Store<any> | Namespace, map?: KnownKeys<TActions>[]): ExtractTypes<TActions, Function>;
export function useActions<TActions = any>(store: Store<any> | Nullish, namespace?: Namespace, map?: KnownKeys<TActions>[]): ExtractTypes<TActions, Function>;
export function useActions<TActions = any>(storeOrNamespace: KnownKeys<TActions>[] | Store<any> | Namespace, namespaceOrMap?: KnownKeys<TActions>[] | Namespace, map?: KnownKeys<TActions>[]): ExtractTypes<TActions, Function> {
	let realStore, realNamespace, realMap;
	if (arguments.length >= 3) {
		realStore = storeOrNamespace as Store<any> || getStoreFromInstance();
		realNamespace = namespaceOrMap as string || null;
		realMap = map as KnownKeys<TActions>[] || null;
	} else if (arguments.length === 2) {
		if (typeof storeOrNamespace === 'string') {
			realStore = getStoreFromInstance();
			realNamespace = storeOrNamespace as string || null;
		} else {
			realStore = storeOrNamespace as Store<any> || getStoreFromInstance();
			realNamespace = null
		}
		realMap = namespaceOrMap as KnownKeys<TActions>[] || null;
	} else {
		realStore = getStoreFromInstance();
		realNamespace = null;
		realMap = storeOrNamespace as KnownKeys<TActions>[] || null;
	}
	return useMapping(realStore, realNamespace, realMap, getAction);
}
