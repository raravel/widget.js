import { EventAttribute, EventAttributeCallback } from './events';

type WidgetEventOption = {
	[K in EventAttribute as `$${K}`]?: EventAttributeCallback
}

type WidgetAnotherOption = {
	child?: Widget,
	children?: Widget[],
};

type WidgetOption = WidgetAnotherOption & WidgetEventOption;

export abstract class Widget {

	constructor(options: WidgetOption) {
	}

	abstract  build(context: Widget): Widget;

}

export abstract class TagWidget extends Widget {

	protected abstract readonly tag: string;

	constructor(protected options: WidgetOption) {
		super(options);
	}

	public build(context: Widget): Widget {
		return this;
	}

	public builder(): Node {
		const element = document.createElement(this.tag);
		for ( const [key, value] of Object.entries(this.options) ) {
			if ( key.startsWith('$') ) {
				element.addEventListener(key.replace('$', ''), value as EventAttributeCallback);
			} else {
				//element.setAttribute(key, value as string);
			}
		}

		let child = this.options.child;
		if ( child ) {
			if ( !(child as TagWidget).builder ) {
				child = child.build(this);
			}
			element.appendChild((child as TagWidget).builder());
		}

		if ( Array.isArray(this.options.children) ) {
			for ( let child of this.options.children ) {
				if ( !(child as TagWidget).builder ) {
					child = child.build(this);
				}
				element.appendChild((child as TagWidget).builder());
			}
		}
		return element;
	}

}

export class Text extends TagWidget {
	tag = '';
	constructor(private text: string) {
		super({});
	}

	public build(): TagWidget {
		return this;
	}

	public builder(): Node {
		return document.createTextNode(this.text);
	}

}

export class WidgetApp {

	constructor(private context: Widget) {
	}

	public Start(selector: string|Element): void {
		if ( typeof selector === 'string' ) {
			const tmp = document.querySelector(selector);
			if ( tmp ) {
				selector = tmp;
			}
		}


		const element = this.context.build(this.context) as TagWidget;
		console.log('build', element);
		(selector as Element).appendChild(element.builder());
	}
}
