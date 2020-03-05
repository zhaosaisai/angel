declare global {
    interface XMLHttpRequest {
        _hooks: any;
    }
}
declare function monitorAjax(): void;
export default monitorAjax;
