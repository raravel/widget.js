import _ from 'lodash';

interface ElementEntity {
	_childs: (Element|string)[];
	_handler: Array<(...args: any[]) => void>;
	_options?: ElementOption;
	tag: string;
	Attr: (key: string, value: string) => Element;
	Data: (key: string, value: string) => Element;
	Build: () => Node;
}

type Element = ((...childs: (Element|string)[]) => Element) & ElementEntity;

interface ElementAttribute {
	default: string;
}

type ElementAttr = Record<string, ElementAttribute>;

interface ElementOption {
	tag: string;
	attr?: ElementAttr;
	event?: string[];
	methods?: Record<string, (...args: any[]) => any>;
}

function ElementAttr(this: any, key: string, value: string) {
	if ( this.hasOwnProperty(key) ) {
		this[key] = value;
		return this;
	}

	let v: string = value;
	Object.defineProperty(this, key, {
		get: () => v,
		set: (newVal: string) => {
			this._handler.forEach(async h => h(key));
			v = newVal;
		},
	});

	return this;
}

function ElementData(this: any, key: string, value?: string) {
	if ( value ) {
		// set mode
		this.Attr('data-' + key, value);
		return this;
	} else {
		// get mode
		return this['data-' + key];
	}
}

function ElementHandler(key) {
	console.log('handler call', key);
}

function ElementBuild(this: Element): Node {
	if ( this.tag === 'text' ) {
		return document.createTextNode(this._childs[0] as string);
	}
	const element = document.createElement(this.tag);

	if ( this.hasOwnProperty('_options') ) {
		const options = this._options as ElementOption;
		if ( typeof options.attr === 'object' ) {
			Object.entries(options.attr as ElementAttr).forEach(([name]) => {
				if ( this.hasOwnProperty(name) ) {
					if ( this[name] ) {
						element.setAttribute(name, this[name]);
					}
				}
			});
		}
	}

	(this._childs as Element[]).forEach((child: Element) => {
		element.appendChild(child.Build());
	});
	return element;
}

function GeneratorFunction(this: Element, ...childs: (Element|string)[]) {
	this._childs = childs;
	return this;
}

export function ElementExtends<T>(parent: Element, options: ElementOption): T & typeof parent {
	parent = _.cloneDeep(parent);
	const caller: Element = ((...childs: (Element|string)[]) => {
		caller._childs = childs;
		return caller;
	}) as Element;
	Object.entries(parent).forEach(([key, val]) => {
		caller[key] = val;
	});

	if ( options.tag ) {
		caller.tag = options.tag;
	}

	Object.defineProperty(caller, '_options', {
		value: options,
		writable: false,
	});

	caller.Attr = ElementAttr.bind(caller);
	caller.Data = ElementData.bind(caller);
	caller.Build = ElementBuild.bind(caller);

	if ( typeof (options.attr) === 'object' ) {
		Object.entries(options.attr)
			.forEach(([ name, attr ]) => {
				caller.Attr(name, attr.default);
			});
	}

	if ( typeof (options.methods) === 'object' ) {
		Object.entries(options.methods)
			.forEach(([ name, method ] ) => {
				caller[name] = method.bind(caller);
			});
	}

	return caller as T & typeof parent;
}

export function ElementGenerator<T>(options: ElementOption): T & Element {
	const obj: Element = GeneratorFunction.bind({} as Element) as Element;
	obj._childs = [];
	obj._handler = [ ElementHandler, ];
	obj.tag = '';

	return ElementExtends<T>(obj, options);
}
