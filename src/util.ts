import {computed} from '@vue/composition-api';

export interface Mapper<T = string> {
	[key: string]: T
}

function useFromArray(store: any, namespace: string | null, props: Array<string>, cb: Function) {
	return props.reduce((result, prop) => {
		result[prop] = cb(store, namespace ? `${namespace}/${prop}` : prop);
		return result;
	}, {} as any);
}

function useFromObject(store: any, namespace: string | null, props: Mapper, cb: Function) {
	const obj: any = {};
	for (let key in props) {
		if (props.hasOwnProperty(key)) {
			obj[key] = cb(store, namespace ? `${namespace}/${props[key]}` : props[key]);
		}
	}
	return obj;
}

export function computedGetter<T = any>(store: any, prop: string) {
	return computed<T>(() => store.getters[prop]);
}

export function getMutation(store: any, mutation: string): Function {
	return function () {
		return store.commit.apply(store, [mutation, ...arguments]);
	}
}

export function getAction(store: any, action: string): Function {
	return function () {
		return store.dispatch.apply(store, [action, ...arguments]);
	}
}

export function useMapping(store: any, namespace: string | null, map: Mapper | Array<string>, cb: Function) {
	if (map instanceof Array) {
		return useFromArray(store, namespace, map, cb);
	} else {
		return useFromObject(store, namespace, map, cb);
	}
}
