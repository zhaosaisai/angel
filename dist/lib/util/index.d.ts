declare global {
    interface Navigator {
        userLanguage: string;
    }
}
export declare const getLanguage: () => string;
export declare const setDefault0: (end: number, start: number) => number;
export declare const getPerformanceMetric: (endTag: string, startTag: string) => number;
export declare const isScriptError: (message: string) => boolean;
export declare const getStaticAttrs: (target: any) => {
    url: any;
    async: any;
    defer: any;
} | {
    url: any;
    async?: undefined;
    defer?: undefined;
} | {
    url?: undefined;
    async?: undefined;
    defer?: undefined;
};
export declare const isError: (error: any) => boolean;
export declare const validateStatus: (status: number) => boolean;
