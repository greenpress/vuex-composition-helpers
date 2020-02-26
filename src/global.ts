import {computed} from '@vue/composition-api';
import {computedGetter, getAction, getMutation, Mapper, useMapping} from './util';

function computedState(store, prop) {
	return computed(() => store.state[prop])
}

export function useState(store, map: Mapper | Array<string>): { [key: string]: any } {
	return useMapping(store, null, map, computedState);
}

export function useGetters(store, map: Mapper | Array<string>): { [key: string]: any } {
	return useMapping(store, null, map, computedGetter);
}

export function useMutations(store, map: Mapper | Array<string>): { [key: string]: Function } {
	return useMapping(store, null, map, getMutation);
}

export function useActions(store, map: Mapper | Array<string>): { [key: string]: Function } {
	return useMapping(store, null, map, getAction);
}
