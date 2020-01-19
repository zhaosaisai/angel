## 性能指标

> Referenced from [https://help.aliyun.com/document_detail/60288.html](https://help.aliyun.com/document_detail/60288.html)

![](http://static-aliyun-doc.oss-cn-hangzhou.aliyuncs.com/assets/img/152286/156757245143777_zh-CN.png)

### 阶段耗时

| 上报字段 | 描述 | 计算方式 | 备注 |
| :--------:| :-----:| :--------:| :-----:|
| dns | DNS解析耗时 | domainLookupEnd - domainLookupStart | 无 |
| tcp | TCP 连接耗时 | connectEnd - connectStart | 无 |
| ssl | SSL 安全连接耗时 | connectEnd - secureConnectionStart | 只在 HTTPS 下有效 |
| ttfb | Time to First Byte（TTFB），网络请求耗时 | responseStart - requestStart | TTFB 有多种计算方式，ARMS 以 Google Development 定义为准 |
| trans | 数据传输耗时 | responseEnd - responseStart | 无 |
| dom | DOM 解析耗时 | domInteractive - responseEnd | 无 |
| res | 资源加载耗时 | loadEventStart - domContentLoadedEventEnd | 表示页面中的同步加载资源 |

### 关键性能指标

| 上报字段 | 描述 | 计算方式 | 备注 |
| :--------:| :-----:| :--------:| :-----:|
| firstbyte | 首包时间 | responseStart - domainLookupStart | 无 |
| fpt | First Paint Time, 首次渲染时间 / 白屏时间 | responseEnd - fetchStart | 从请求开始到浏览器开始解析第一批 HTML 文档字节的时间差 |
| tti | Time to Interact，首次可交互时间 | domInteractive - fetchStart | 浏览器完成所有 HTML 解析并且完成 DOM 构建，此时浏览器开始加载资源 |
| ready | HTML 加载完成时间， 即 DOM Ready 时间 | domContentLoadEventEnd - fetchStart | 如果页面有同步执行的 JS，则同步 JS 执行时间 = ready - tti |
| load | 页面完全加载时间 | loadEventStart - fetchStart | load = 首次渲染时间 + DOM 解析耗时 + 同步 JS 执行 + 资源加载耗时 |
