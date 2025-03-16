import van from './van.js';
/** 返回当前的 `location.hash` 值的 `#/` 后面的部分，如果为空则返回 `home` */
export const nowHash = () => location.hash ? location.hash.slice(2) : 'home';
/** 当前的 Hash 值，不含开头的 #，值通过 `nowHash()` 返回。 */
export const now = van.state(nowHash());
window.addEventListener('hashchange', () => {
    now.val = nowHash();
});
/** 路由处理程序实例 */
export class Handler {
    rule;
    /** 当前路由被命中后接收到的路由参数 */
    args = [];
    Loader;
    delayed = false;
    onFirst;
    onLoad;
    /** 路由根元素，对外导出，可直接添加到 DOM 树 */
    element;
    /** 记录当前是否初次命中路由，决定是否执行 `onFirst` 事件。 */
    isFirstLoad = true;
    constructor(config) {
        if (!config)
            throw new Error('config 不能为空');
        if (!config.rule)
            throw new Error('rule 不能为空');
        if (!config.Loader)
            throw new Error('Loader 不能为空');
        // 载入路由的基础配置
        this.rule = config.rule;
        this.Loader = config.Loader;
        this.delayed = config.delayed || false;
        this.onFirst = config.onFirst || (async () => { });
        this.onLoad = config.onLoad || (async () => { });
        // 创建页面元素
        this.element = this.Loader();
        this.element.hidden = true;
        // 根据 Hash 的变化，自动更新路由状态
        const func = async () => {
            // 获取当前路由的命中状态
            const match = this.matchHash();
            if (!match) {
                // 未被命中，刷新路由，页面隐藏。
                this.hide();
            }
            else {
                // 路由命中
                // 将接收到的路由参数保存起来
                this.args.splice(0); // 清空存储的旧参数
                this.args.push(...match.args);
                if (this.isFirstLoad) {
                    this.isFirstLoad = false;
                    await this.onFirst();
                }
                await this.onLoad();
                if (!this.delayed)
                    this.show();
            }
        };
        window.addEventListener('hashchange', func);
        func();
    }
    /** 判断当前 Hash 是否与本路由的规则匹配 */
    matchHash() {
        if (this.rule instanceof RegExp) {
            const match = now.val.match(this.rule);
            if (!match)
                return false;
            return { hash: now.val, args: [...match].slice(1) };
        }
        const parts = now.val.split('/').filter(i => i.length > 0);
        if (parts.length < 1)
            parts.push('home');
        return parts[0] == this.rule ? { hash: now.val, args: parts.slice(1) } : false;
    }
    /** 显示当前路由元素 */
    show() {
        this.element.hidden = false;
    }
    /** 隐藏当前路由元素 */
    hide() {
        this.element.hidden = true;
    }
}
/** 创建一个自动管理路由状态的 DOM 元素 */
export const Route = (config) => new Handler(config).element;
/**
 * 跳转到指定 Hash
 * @param name 需要前往的路由名称，对应字符串类型的 rule
 * @param args 路由参数
 */
export const goto = (name, ...args) => {
    location.hash = name == 'home' && args.length == 0 ? '' : `/${[name, ...args].join('/')}`;
};
/**
 * 路由重定向
 * @param from 来源路由规则，用于定义 `rule` 属性
 * @param to 目标路由规则，用于传入 `goto` 方法进行跳转
 */
export const redirect = (from, to) => {
    Route({
        rule: from,
        Loader: van.tags.div,
        onLoad() {
            goto(to);
        },
    });
};
/** `vanjs-router` */
export default { nowHash, now, Handler, Route, goto, redirect };
