import {computed} from '@vue/composition-api';
import {computedGetter, getAction, getMutation, Mapper, useMapping} from './util';

function computedState(store: any, prop: string) {
	return computed(() => store.state[prop])
}

export function useState(store: any, map: Mapper | Array<string>): Mapper<any> {
	return useMapping(store, null, map, computedState);
}

export function useGetters(store: any, map: Mapper | Array<string>): Mapper<any> {
	return useMapping(store, null, map, computedGetter);
}

export function useMutations(store: any, map: Mapper | Array<string>): Mapper<Function> {
	return useMapping(store, null, map, getMutation);
}

export function useActions(store: any, map: Mapper | Array<string>): Mapper<Function> {
	return useMapping(store, null, map, getAction);
}
