import {computed} from '@vue/composition-api';

export interface Mapper {
	[key: string]: string
}

function useFromArray(store, namespace: string, props: Array<string>, cb: Function) {
	return props.reduce((result, prop) => {
		result[prop] = cb(store, namespace ? `${namespace}/${prop}` : prop);
		return result;
	}, {});
}

function useFromObject(store, namespace: string, props: Mapper, cb: Function) {
	const obj = {};
	for (let key in props) {
		if (props.hasOwnProperty(key)) {
			obj[key] = cb(store, namespace ? `${namespace}/${props[key]}` : props[key]);
		}
	}
	return obj;
}

export function computedGetter(store, prop) {
	return computed(() => store.getters[prop])
}

export function getMutation(store, mutation) {
	return (...args) => store.commit.apply(store, [mutation, ...args])
}

export function getAction(store, action) {
	return (...args) => store.dispatch.apply(store, [action, ...args])
}

export function useMapping(store, namespace: string, map, cb) {
	if (map instanceof Array) {
		return useFromArray(store, namespace, map, cb);
	} else {
		return useFromObject(store, namespace, map, cb);
	}
}
