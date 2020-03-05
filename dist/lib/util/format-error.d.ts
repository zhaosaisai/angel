declare global {
    interface Error {
        column?: number;
        columnNumber?: number;
        line?: number;
        lineNumber?: number;
    }
}
export default function formatError(error: any): any;
