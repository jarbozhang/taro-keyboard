import { View } from '@tarojs/components'
import { vibrateShort, eventCenter } from '@tarojs/taro'
import { useState, useEffect, useCallback, useMemo } from 'react'
import './index.scss'

const SPECIAL_SYMBOL: string[] = ['dot', '0', 'hide', 'enter', 'back']
const KEYBOARD_VALUE: string[] = [...[...Array(9).keys()].map(item => (item + 1).toString()), ...SPECIAL_SYMBOL]
const getConfirmTextByType = type => {
  return (
    {
      send: '发送',
      search: '搜索',
      next: '下一项',
      go: 'GO',
      done: '完成'
    }[type] || '确认'
  )
}

interface IKeyboard {
  confirmType?: 'send' | 'search' | 'next' | 'go' | 'done'
  onInput?: (args: 'string') => void
  onFocus?: () => void
  onBlur?: () => void
}

const getIconOrTextByValue = (input: string, confirmType): string => {
  if ([...[...Array(10)].keys()].map(item => item.toString()).includes(input)) return input
  else return { dot: '.', enter: getConfirmTextByType(confirmType) }[input] || ''
}

const onInput = ({ e, active, setActive, onBlur, type = 'click' }): void => {
  const { value } = e.currentTarget.dataset
  eventCenter.trigger('keyboardInput', value === 'back' && type === 'longPress' ? 'clear' : value)
  e.stopPropagation()
  if (['enter', 'hide'].includes(value) && active) {
    eventCenter.trigger('hideKeyboard')
    setActive(false)
    typeof onBlur === 'function' && onBlur()
  } else vibrateShort()
}

export default (props: IKeyboard): JSX.Element => {
  const [active, setActive] = useState(false)
  const { onFocus, onBlur, confirmType = 'done' } = props

  const showKeyboard = useCallback(() => {
    eventCenter.on('showKeyboard', () => {
      console.log('showKeyboard')
      setActive(true)
      typeof onFocus === 'function' && onFocus()
    })
    return () => {
      eventCenter.off('showKeyboard')
    }
  }, [])
  useEffect(() => showKeyboard(), [showKeyboard])

  return (
    <View
      className={'container ' + (active ? 'show' : 'hide')}
      onClick={() => {
        if (active) {
          eventCenter.trigger('hideKeyboard')
          setActive(false)
          typeof onBlur === 'function' && onBlur()
        }
      }}
    >
      <View className='keyboard'>
        {KEYBOARD_VALUE.map(item => (
          <View
            className={'item ' + item}
            key={item}
            data-value={item}
            hoverClass='hover'
            hoverStayTime={50}
            onClick={e => onInput({ e, active, setActive, onBlur })}
            onLongPress={e => onInput({ e, active, setActive, onBlur, type: 'longPress' })}
          >
            {getIconOrTextByValue(item, confirmType)}
          </View>
        ))}
      </View>
    </View>
  )
}
