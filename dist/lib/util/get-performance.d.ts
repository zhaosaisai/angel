declare global {
    interface Window {
        mozPerformance: Performance;
        msPerformance: Performance;
        webkitPerformance: Performance;
    }
}
export default function getPerformance(): Performance;
