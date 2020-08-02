(window.webpackJsonp=window.webpackJsonp||[]).push([[335],{1011:function(n,e){n.exports="### HOC 实践\n\n高阶组件(Higher Order Component) 不属于 React API 范畴, 但是它在 React 中也是一种实用的技术, `它可以将常见任务抽象成一个可重用的部分`。这个小节算是番外篇, 会结合 [cpreact](https://github.com/MuYunyun/cpreact)(前文实现的类 react 轮子) 与 HOC 进行相关的实践。\n\n它可以用如下公式表示:\n\n```js\ny = f(x),\n\n// x: 原有组件\n// y: 高阶组件\n// f():\n```\n\n`f()` 的实现有两种方法, 下面进行实践。\n\n#### 属性代理(Props Proxy)\n\n属性代理是装饰器模式的一种运用, 通过装饰器函数给原来函数赋能。下面例子在装饰器函数中给被装饰的组件传递了额外的属性 `{ a: 1, b: 2 }`。\n\n> 声明: 下文所展示的 demo 均已在 [cpreact](https://github.com/MuYunyun/cpreact) 测试通过\n\n```js\nfunction ppHOC(WrappedComponent) {\n  return class extends Component {\n    render() {\n      const obj = { a: 1, b: 2 }\n      return (\n        <WrappedComponent { ...this.props } { ...obj } />\n      )\n    }\n  }\n}\n\n@ppHOC\nclass B extends Component {\n  render() {\n    return (\n      <div>\n        { this.props.a + this.props.b } { /* 输出 3 */ }\n      </div>\n    )\n  }\n}\n```\n\n要是将 { a: 1, b: 2 } 替换成全局共享对象, 那么不就是 react-redux 中的 Connect 了么?\n\n改进上述 demo, 我们就可以实现可插拔的[受控组件](https://reactjs.org/docs/forms.html#controlled-components), 代码示意如下:\n\n```js\nfunction ppDecorate(WrappedComponent) {\n  return class extends Component {\n    constructor() {\n      super()\n      this.state = {\n        value: ''\n      }\n      this.onChange = this.onChange.bind(this)\n    }\n\n    onChange(e) {\n      this.setState({\n        value: e.target.value\n      })\n    }\n\n    render() {\n      const obj = {\n        onChange: this.onChange,\n        value: this.state.value,\n      }\n\n      return (\n        <WrappedComponent { ...this.props } { ...obj } />\n      )\n    }\n  }\n}\n\n@ppDecorate\nclass B extends Component {\n  render() {\n    return (\n      <div>\n        <input { ...this.props } />\n        <div>{ this.props.value }</div>\n      </div>\n    )\n  }\n}\n```\n\n效果如下图:\n\n![](http://with.muyunyun.cn/hoc%E6%8E%A2%E7%B4%A2%E4%B9%8B%E5%8F%97%E6%8E%A7%E7%BB%84%E4%BB%B6.gif)\n\n这里有个坑点, 当我们在输入框输入字符的时候, 并不会立马触发 onChange 事件(我们想要让事件立即触发, 然而现在要按下回车键或者点下鼠标才触发), 在 react 中有个[合成事件](https://reactjs.org/docs/events.html) 的知识点, 下篇文章 [onChange 事件](https://github.com/MuYunyun/blog/blob/master/从0到1实现React/9.onChange事件的那点事.md) 对 react 中的 onChange 事件为何和原生 DOM 事件中的 onchange 表现不一致进行揭秘。\n\n顺带一提在这个 demo 中似乎看到了双向绑定的效果, 但是实际中 React 并没有双向绑定的概念, 但是我们可以运用 HOC 的知识点结合 setState 在 React 表单中实现伪双向绑定的效果。\n\n#### 继承反转(Inheritance Inversion)\n\n继承反转的核心是: 传入 HOC 的组件会作为返回类的父类来使用。然后在 render 中调用 `super.render()` 来调用父类的 render 方法。\n\n> 在 [ES6 继承与 ES5 继承的差异](https://github.com/MuYunyun/blog/blob/master/BasicSkill/readES6/继承.md#作为对象调用的-super)中提到了作为对象使用的 super 指向父类的实例。\n\n```js\nfunction iiHOC(WrappedComponent) {\n  return class extends WrappedComponent {\n    render() {\n      const parentRender = super.render()\n      if (parentRender.nodeName === 'span') {\n        return (\n          <span>继承反转</span>\n        )\n      }\n    }\n  }\n}\n\n@iiHOC\nclass B extends Component {\n  render() {\n    return (\n      <span>Inheritance Inversion</span>\n    )\n  }\n}\n```\n\n在这个 demo 中, 在 HOC 内实现了渲染劫持, 页面上最终显示如下:\n\n![](http://with.muyunyun.cn/e7dbedcefd9a61dcd12fbcff89dc19ef.jpg-200)\n\n> 可能会有疑惑, 使用`属性代理`的方式貌似也能实现渲染劫持呀, 但是那样做没有`继承反转`这种方式纯粹。\n\n### 相关链接\n\n* [带着三个问题深入浅出 React 高阶组件](https://juejin.im/post/59818a485188255694568ff2)\n* [深入理解 React 高阶组件](https://zhuanlan.zhihu.com/p/24776678?refer=FrontendMagazine)"}}]);