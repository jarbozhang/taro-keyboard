import { Input } from '@tarojs/components'
import { useEffect, useState, useCallback } from 'react'
import { pageScrollTo, createSelectorQuery, getSystemInfoSync, nextTick, eventCenter } from '@tarojs/taro'
import './index.scss'

interface InputProps {
  id?: string
  value?: string
  type?: 'text' | 'digit' | 'number'
  placeholder?: string
  enabled?: boolean
  onInput?: (args: string) => {}
  onConfirm?: (args: string) => void
}

const RANDOM_ID = () =>
  'input' +
  Math.random()
    .toString(36)
    .substring(2, 15)

const scrollToRightPosition = (randomId: string ) => {
  nextTick(() => {
    const query = createSelectorQuery()
    query.select(`#${randomId}`).boundingClientRect()
    query.select('.keyboard').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(res => {
      const { top: inputTop, height: inputHeight } = res[0] || {}
      const { height: keyboardHeight } = res[1] || {}
      const { scrollTop: screenScrollTop } = res[2] || {}
      const { windowHeight: screenHeight } = getSystemInfoSync()
      const scrollTop = screenScrollTop + inputTop + inputHeight + 10 - (screenHeight - keyboardHeight)
      pageScrollTo({ scrollTop, duration: 200 })
    })
  })
}

export default (props: InputProps): JSX.Element => {
  const { value = '', placeholder, onConfirm, onInput, enabled = false, id } = props
  const [inputValue, setInputValue] = useState(value)
  const [focus, setFocus] = useState(false)
  const randomId = id || RANDOM_ID()

  const showKeyboard = useCallback(() => {
    console.log('trigger', randomId)
    eventCenter.trigger('showKeyboard')
    scrollToRightPosition(randomId)
    setFocus(true)
  }, [randomId])

  useEffect(() => {
    if (focus) {
      eventCenter.on('keyboardInput', args => {
        typeof onInput === 'function' && onInput(args)
        if (args === 'back')
          setInputValue(prevValue => (prevValue && prevValue?.length > 0 ? prevValue?.slice(0, -1) : prevValue))
        else if (args === 'clear') setInputValue('')
        else if (args === 'enter') typeof onConfirm === 'function' && onConfirm(inputValue || '')
        else if (args === 'hide') setInputValue(val => val)
        else setInputValue(prevValue => prevValue + (args === 'dot' ? '.' : args))
      })
      eventCenter.on('hideKeyboard', () => setFocus(false))
    } else {
      eventCenter.off('hideKeyboard')
      eventCenter.off('keyboardInput')
    }
    return () => {
      eventCenter.off('hideKeyboard')
      eventCenter.off('keyboardInput')
    }
  }, [focus])

  useEffect(() => {
    enabled && showKeyboard()
  }, [enabled, showKeyboard])

  return (
    <Input
      id={randomId}
      className={focus ? 'input focus' : 'input'}
      placeholder={placeholder}
      value={inputValue}
      disabled
      onClick={() => showKeyboard()}
    />
  )
}
