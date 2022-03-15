export class State<T extends Record<string, unknown>> {

    state = new Proxy({} as T, {
        get: (target: T, key: Extract<keyof T, string>) => {
            return target[key];
        },
        set: (target: T, key: Extract<keyof T, string>, value: any) => {
            target[key] = value;
            console.log('change');
            return true;
        },
    });

    setState(callback: (...args: any[]) => void): void {
        callback(this.state)
    }

    notify() {
        if ( typeof (this as any).build === 'function' ) {
            (this as any).build(this);
        }
    }
}