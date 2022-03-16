type Function = (...args: any[]) => void;

export class State<T extends object> {

    private state;
    private observer: Function[] = [];

    constructor(state: {} = {}) {
        this.state = new Proxy<T>(state as T, {
            get: (target: T, key: Extract<keyof T, string>) => {
                return target[key];
            },
            set: (target: T, key: Extract<keyof T, string>, value: any) => {
                target[key] = value;
                return true;
            },
        });

        return new Proxy(this, {
            get: (target: this & T, key: string) => {
                return this[key] ? this[key] : this.state[key];
            },
            set: (target: this & T, key: string, value: any) => {
                if ( this[key] ) {
                    this[key] = value;
                } else {
                    this.state[key] = value;
                }
                return true;
            },
        });
    }

    observe(callback: Function): void {
        this.observer.push(callback);
    }

    setState(callback: Function): void {
        callback(this.state);
        this.notify();
    }

    get getters(): T {
        return this.state;
    }

    notify() {
        for ( const callback of this.observer ) {
            callback();
        }
    }
}
