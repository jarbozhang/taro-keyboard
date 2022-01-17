# 基于 Taro 实现的小程序自定义键盘

由于微信小程序的数字键盘功能有限（缺少完成或下一项等功能)，在有些场景下实在无法满足需求，故有此项目。


<img src="https://user-images.githubusercontent.com/2065312/149666134-9f5c9926-6119-4a27-b085-e242b66332c0.jpeg">

## 简介
由于本项目需要支持多个Input共用同一个Keyboard，故Input和Keyboard被拆分成两个组件，通过两个组件的大部分方法来替代小程序Input的API中的方法，你可以看到onInput、onConfirm是在Input中定义的，而onFocus、onBlur是在Keyboard中定义的，使用时可以参照pages/index/index.tsx的代码进行使用。

组件中使用了Taro的eventCenter来实现的组件间通讯，修改时请注意eventCenter的订阅和触发方法可能会在hooks的useEffect中重新被覆盖导致UI上的问题。

Input组件的id属性可以不传，内部利用randomId来进行处理，当然比较建议根据业务实际情况进行定义。

由于组件的复杂性，目前未找到合适的打包npm的方式，如果有朋友知道如何修改的话非常欢迎。

## 类组件的修改注意
由于项目使用的是hooks运行在函数式组件中，当您需要移植到类组件的项目中（例如taro2.x的系统中，自组件用#shadow-root包裹），需要注意createSelectorQuery的使用方式，目前是从Tarojs/taro导入，但是类组件中，需要使用this.$scope.createSelectorQuery()这样才能获取到自组件中的位置信息。注意input的click事件中一定要按照bind this方式把this传进去才能完成获取组件信息。
参见:https://developers.weixin.qq.com/community/develop/doc/000aa0f17a8af0e02d7c0ca5e56800

## 后续计划
组件类型方面打算添加自定义车牌等功能，敬请期待。
另外针对类组件，我已经进行了更新，打算新开一个branch push上来。
