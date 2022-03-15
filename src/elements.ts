import { TagWidget, Widget } from './widget';

export class Div extends TagWidget {

	protected readonly tag = 'div';

	build(context: Widget): Widget {
		return this;
	}

}

export class A extends TagWidget {

	protected readonly tag = 'a';

	build(context: Widget): Widget {
		return this;
	}

}

export class H1 extends TagWidget {

	protected readonly tag = 'h1';

	build(context: Widget): Widget {
		return this;
	}

}
