import { View } from '@tarojs/components'
import React, { useEffect, useState } from 'react'
import { pageScrollTo, createSelectorQuery, nextTick } from '@tarojs/taro'
import Keyboard from '../../components/keyboard'
import Input from '../../components/input'
import './index.scss'

const getPageScrollTop = (setScrollTop: React.Dispatch<React.SetStateAction<number>>) => {
  nextTick(() => {
    const query = createSelectorQuery()
    query.select('.input').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(res => setScrollTop(res[1]['scrollTop'] || 0))
  })
}

export default () => {
  const [keyboardActive, setKeyboardActive] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const [nextFocusId, setNextFocusId] = useState(-1)
  useEffect(() => {
    pageScrollTo({ scrollTop, duration: 1 })
  }, [keyboardActive, scrollTop])
  return (
    <View className={keyboardActive ? 'page expand' : 'page'}>
      {[...[...Array(30).keys()]].map(item => (
        <Input
          key={item}
          id={'input' + item}
          placeholder={`请输入数字${item}...`}
          onConfirm={() => {
            setNextFocusId(3)
          }}
          enabled={item === nextFocusId}
        />
      ))}
      <Keyboard
        confirmType='next'
        onFocus={() => setKeyboardActive(true)}
        onBlur={() => {
          getPageScrollTop(setScrollTop)
          setKeyboardActive(false)
        }}
      />
    </View>
  )
}
