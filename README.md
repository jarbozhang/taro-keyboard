# 基于 Taro 实现的小程序自定义键盘

由于微信小程序的数字键盘功能有限（缺少完成或下一项等功能，在有些场景下实在无法满足需求，故有此项目。


<img src="https://user-images.githubusercontent.com/2065312/149666134-9f5c9926-6119-4a27-b085-e242b66332c0.jpeg">

## 简介
由于本项目需要支持多个Input共用同一个Keyboard，故Input和Keyboard被拆分成两个组件，通过两个组件的大部分方法来替代小程序Input的API中的方法，你可以看到onInput、onConfirm是在Input中定义的，而onFocus、onBlur是在Keyboard中定义的，使用时可以参照pages/index/index.tsx的代码进行使用。

组件中使用了Taro的eventCenter来实现的组件间通讯，修改时请注意eventCenter的订阅和触发方法可能会在hooks的useEffect中重新被覆盖导致UI上的问题。

Input组件的id属性可以不传，内部利用randomId来进行处理，当然比较建议根据业务实际情况进行定义。

由于组件的复杂性，目前未找到合适的打包npm的方式，如果有朋友知道如何修改的话非常欢迎。
## 后续计划
后续打算添加自定义车牌等功能，敬请期待。

