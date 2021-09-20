import {Store} from 'vuex/types';
import {computed} from '@vue/composition-api';
import {computedGetter, getAction, getMutation, getStoreFromInstance, useMapping, ExtractGetterTypes, ExtractTypes, KnownKeys, RefTypes} from './util';

function computedState(store: any, prop: string) {
	return computed(() => store.state[prop]);
}

/**
 * Get the vuex store from the root vue instance
 *
 * @example
 * const store = useStore();
 */
export function useStore<TState = any>() {
	return getStoreFromInstance() as Store<TState>
}

/**
 * Gets the root state of the vuex store.
 *
 * Injects the vuex store from the root vue instance.
 * @param map An array of known Root State keys
 *
 * @example
 * const { foo, bar } = useState(['foo', 'bar']);
 */
export function useState<TState>(map: KnownKeys<TState>[]): RefTypes<TState>
/**
 * Gets the root State of the provided vuex store.
 * @param store An instance of the vuex store to get the state from
 * @param map An array of known Root State keys
 *
 * @example
 * const { foo, bar } = useState(store, ['foo', 'bar']);
 */
export function useState<TState>(store: Store<TState>, map: KnownKeys<TState>[]): RefTypes<TState>
export function useState<TState = any>(storeOrMap: Store<TState> | KnownKeys<TState>[], map?: KnownKeys<TState>[]): RefTypes<TState> {
	let store = storeOrMap;

	if (arguments.length === 1) {
		map = store as KnownKeys<TState>[];
		store = getStoreFromInstance();
	}
	return useMapping(store as Store<TState>, null, map, computedState);
}

/**
 * Retrieves getters for the given keys.
 *
 * Injects the vuex store from the root vue instance.
 * @param map An array of known Getter keys
 *
 * @example
 * const { fooGetter, barGetter } = useGetters(['fooGetter', 'barGetter']);
 */
export function useGetters<TGetters = any>(map: KnownKeys<TGetters>[]): ExtractGetterTypes<TGetters>
/**
 * Retrieves getters for the provided vuex store.
 * @param store An instance of the vuex store to retrieve the getters from
 * @param map An array of known Getter keys
 *
 * @example
 * const { fooGetter, barGetter } = useGetters(store, ['fooGetter', 'barGetter']);
 */
export function useGetters<TGetters = any>(store: Store<any>, map: KnownKeys<TGetters>[]): ExtractGetterTypes<TGetters>
export function useGetters<TGetters = any>(storeOrMap: Store<any> | KnownKeys<TGetters>[], map?: KnownKeys<TGetters>[]): ExtractGetterTypes<TGetters> {
	let store = storeOrMap;
	if (arguments.length === 1) {
		map = store as KnownKeys<TGetters>[];
		store = getStoreFromInstance();
	}
	return useMapping(store as Store<any>, null, map, computedGetter);
}

/**
 * Retrieves mutations for the given keys.
 *
 * Injects the vuex store from the root vue instance.
 * @param map An array of known mutation keys
 *
 * @example
 * const { setFoo, setBar } = useMutations(['setFoo', 'setBar']);
 */
export function useMutations<TMutations = any>(map: KnownKeys<TMutations>[]): ExtractTypes<TMutations, Function>
/**
 * Retrieves mutations from the provided vuex store.
 * @param store An instance of the vuex store to retrieve the mutations from
 * @param map An array of known mutation keys
 *
 * @example
 * const { setFoo, setBar } = useMutations(store, ['setFoo', 'setBar']);
 */
export function useMutations<TMutations = any>(store: Store<any>, map: KnownKeys<TMutations>[]): ExtractTypes<TMutations, Function>
export function useMutations<TMutations = any>(storeOrMap: Store<any> | KnownKeys<TMutations>[], map?: KnownKeys<TMutations>[]): ExtractTypes<TMutations, Function> {
	let store = storeOrMap;

	if (arguments.length === 1) {
		map = store as KnownKeys<TMutations>[];
		store = getStoreFromInstance();
	}
	return useMapping(store as Store<any>, null, map, getMutation);
}

/**
 * Retrieves actions for the given keys.
 *
 * Injects the vuex store from the root vue instance.
 * @param map An array of known action keys
 *
 * @example
 * const { doFoo, doBar } = useActions(['doFoo', 'doBar']);
 */
export function useActions<TActions = any>(map: KnownKeys<TActions>[]): ExtractTypes<TActions, Function>
/**
 * Retrieves actions from the provided vuex store.
 * @param store An instance of the vuex store to retrieve the actions from
 * @param map An array of known action keys
 *
 * @example
 * const { doFoo, doBar } = useActions(store, ['doFoo', 'doBar']);
 */
export function useActions<TActions = any>(store: Store<any>, map: KnownKeys<TActions>[]): ExtractTypes<TActions, Function>
export function useActions<TActions = any>(storeOrMap: Store<any> | KnownKeys<TActions>[], map?: KnownKeys<TActions>[]): ExtractTypes<TActions, Function> {
	let store = storeOrMap;

	if (arguments.length === 1) {
		map = store as KnownKeys<TActions>[];
		store = getStoreFromInstance();
	}
	return useMapping(store as Store<any>, null, map, getAction);
}
