import { useTheme } from '@emotion/react'
import { Typography, ListSubheader, useMediaQuery } from '@mui/material'
import { createContext, forwardRef, useContext, useEffect, useRef } from 'react'

import { VariableSizeList } from 'react-window'
import IconifyIcon from 'src/@core/components/icon'

const OuterElementContext = createContext({})

const OuterElementType = forwardRef((props, ref) => {
  const outerProps = useContext(OuterElementContext)

  return <div ref={ref} {...props} {...outerProps} />
})

function useResetCache(data) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true)
    }
  }, [data])

  return ref
}

function renderRow(props) {
  const { data, index, style } = props
  const dataSet = data[index]

  const inlineStyle = {
    ...style,
    fontSize: 12,
    minWidth: 100
  }

  if (dataSet.hasOwnProperty('group')) {
    return (
      <ListSubheader key={dataSet.key} component='div' style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    )
  }

  return (
    <Typography component='li' {...dataSet[0]} noWrap style={inlineStyle}>
      {dataSet[3] && <IconifyIcon icon={dataSet[1].value} />}
      {`${dataSet[1].label.replace('-', ' ')}`}
    </Typography>
  )
}

export const ListBoxComponent = forwardRef(function ListBoxComponent(props, ref) {
  const { children, ...other } = props
  const itemData = []
  children.forEach(item => {
    itemData.push(item)
    itemData.push(...(item.children || []))
  })

  const theme = useTheme()

  const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
    noSsr: true
  })
  const itemCount = itemData?.length
  const itemSize = smUp ? 36 : 48

  const getChildSize = child => {
    if (child.hasOwnProperty('group')) {
      return 48
    }

    return itemSize
  }

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize
    }

    return itemData.map(getChildSize).reduce((a, b) => a + b, 0)
  }

  const gridRef = useResetCache(itemCount)

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * 8}
          width='100%'
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType='ul'
          itemSize={index => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  )
})
