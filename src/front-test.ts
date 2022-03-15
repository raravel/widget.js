import { Text, H1, Div, WidgetApp, Widget } from '../src/index';

class MyWidget extends Widget {
	build(context: Widget) {
		return new Div({
			child: new Text('child')
		})
	}
}

new WidgetApp(
	new Div({
		$blur: () => {
		},
		children: [
			new H1({
				child: new Text('h1')
			}),
			new H1({
				child: new Text('h1')
			}),
			new MyWidget({}),
		],
	})
).Start('#app');
