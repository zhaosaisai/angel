declare global {
    interface Window {
        __monitor__: any;
    }
}
declare function Monitor(this: any, config: any): void;
export default Monitor;
