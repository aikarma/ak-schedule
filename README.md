项目来源 
[ppspider](https://github.com/xiyuan-fengyu/ppspider)
一款带界面的爬虫任务管理器

缘起：有时候不需要用到Puppeteer这么重的模块，而且只需要程序在后台默默的运行就好

2020-02-23
目前只用到这3个装饰器，并使用npm link 运行成功。

<!-- toc -->

  * [装饰器](#%E8%A3%85%E9%A5%B0%E5%99%A8)
    + [@Launcher](#launcher)
    + [@OnStart](#onstart)
    + [@OnTime](#ontime)
 

<!-- tocstop -->

# 系统介绍
## 装饰器
申明形式  
```
export function TheDecoratorName(args) { ... }
```
使用方式
```
@TheDecoratorName(args)
```
乍一看和java中的注解一样，但实际上这个更为强大，不仅能提供元数据，还能对类或方法的属性行为做修改装饰，实现切面的效果，ppspider中很多功能都是通过装饰器来提供的  
接下来介绍一下实际开发中会使用到的装饰器  

### @Launcher
```
export function Launcher(appConfig: AppConfig)
```
申明整个爬虫系统的启动入口  
其参数类型为  
```
export type AppConfig = {
    workplace: string; // 系统的工作目录
    queueCache?: string; // 运行状态保存文件的路径，默认为 workplace + "/queueCache.json"
    dbUrl?: string; // 数据库配置，支持 nedb 或 mongodb；少量数据用 nedb，url格式为：nedb://本地nedb存储文件夹；若应用要长期执行，生成数据量大，建议使用 mongodb，url格式为：mongodb://username:password@host:port/dbName；默认："nedb://" + appInfo.workplace + "/nedb"
    tasks: any[]; // 任务类
    dataUis?: any[]; // 需要引入的DataUi
    workerFactorys: WorkerFactory<any>[]; // 工厂类实例
    webUiPort?: 9000 | number; // UI管理界面的web服务器端口，默认9000
    logger?: LoggerSetting; // 日志配置
}
```

### @OnStart
```
export function OnStart(config: OnStartConfig)
```
用于声明一个在爬虫系统启动时执行一次的子任务；后续可以在管理界面上点击该任务名后面的重新执行的按钮即可让该任务重新执行一次  
参数说明  
```
export type OnStartConfig = {
    urls: string | string[]; // 要抓取链接
    running?: boolean; // 系统启动后该队列是否处于工作状态
    parallel?: ParallelConfig; // 任务并行数配置
    exeInterval?: number; // 两个任务的执行间隔时间
    exeIntervalJitter?: number; // 在 exeInterval 基础上增加一个随机的抖动，这个值为左右抖动最大半径，默认为 exeIntervalJitter * 0.25
    timeout?: number; // 任务超时时间，单位：毫秒，默认：300000ms(5分钟)，负数表示永不超时
    maxTry?: number; // 最大尝试次数，默认：3次，负数表示一直尝试    
    description?: string; // 任务描述
    filterType?: Class_Filter; // 添加任务过滤器，默认是 BloonFilter；保存状态后，系统重启时，不会重复执行；如果希望重复执行，可以用 NoFilter    
    defaultDatas?: any; // 该类任务统一预设的job.datas内容
}
```
使用例子 [@OnStart example](https://github.com/xiyuan-fengyu/ppspider_example/blob/master/src/quickstart/App.ts)  

### @OnTime
```
export function OnTime(config: OnTimeConfig) { ... }
```
用于声明一个在特定时刻周期性执行的任务，通过cron表达式设置执行时刻    
参数说明(cron以外的属性说明参考 OnStartConfig)  
```
export type OnTimeConfig = {
    urls: string | string[];
    cron: string; // cron表达式，描述了周期性执行的时刻；不清楚cron表达式的可以参考这里：http://cron.qqe2.com/
    running?: boolean;
    parallel?: ParallelConfig;
    exeInterval?: number;
    exeIntervalJitter?: number;
    timeout?: number;
    maxTry?: number;
    description?: string;
    defaultDatas?: any; // 该类任务统一预设的job.datas内容
}
```
使用例子 [@OnTime example](https://github.com/xiyuan-fengyu/ppspider_example/tree/master/src/ontime/App.ts)  

