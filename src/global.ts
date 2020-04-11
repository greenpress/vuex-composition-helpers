import {Store} from 'vuex/types';
import {computed} from '@vue/composition-api';
import {computedGetter, getAction, getMutation, getStoreFromInstance, Mapper, MapArgument, useMapping} from './util';

function computedState(store: any, prop: string) {
	return computed(() => store.state[prop]);
}

export function useState<T = any>(storeOrMap: Store<T> | MapArgument, map?: MapArgument): Mapper<any> {
	let store = storeOrMap;

	if (arguments.length === 1) {
		map = store as MapArgument;
		store = getStoreFromInstance<T>();
	}
	return useMapping(store, null, map, computedState);
}

export function useGetters<T = any>(storeOrMap: Store<T> | MapArgument, map?: MapArgument): Mapper<any> {
	let store = storeOrMap;
	if (arguments.length === 1) {
		map = store as MapArgument;
		store = getStoreFromInstance<T>();
	}
	return useMapping(store, null, map, computedGetter);
}

export function useMutations<T = any>(storeOrMap: Store<T> | MapArgument, map?: MapArgument): Mapper<Function> {
	let store = storeOrMap;

	if (arguments.length === 1) {
		map = store as MapArgument;
		store = getStoreFromInstance<T>();
	}
	return useMapping(store, null, map, getMutation);
}

export function useActions<T = any>(storeOrMap: Store<T> | MapArgument, map?: MapArgument): Mapper<Function> {
	let store = storeOrMap;

	if (arguments.length === 1) {
		map = store as MapArgument;
		store = getStoreFromInstance<T>();
	}
	return useMapping(store, null, map, getAction);
}
