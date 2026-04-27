// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Imports
import { ContentState, convertFromHTML, EditorState, RichUtils } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { stateToHTML } from 'draft-js-export-html'

const EditorControlled = ({ setHtmlBody, htmlBody }) => {
  // ** State
  const [isStateSet, setIsStateSet] = useState(false)
  const [value, setValue] = useState(EditorState.createEmpty())

  useEffect(() => {
    if (htmlBody?.length == 0) {
      setIsStateSet(false)
    }
    if (htmlBody?.length > 0 && !isStateSet) {
      const blocksFromHTML = convertFromHTML(htmlBody)

      const contentStateFromHtml = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      )
      const editorState = EditorState.createWithContent(contentStateFromHtml)
      setIsStateSet(true)
      setValue(editorState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [htmlBody?.length > 0, !isStateSet])

  const options = {
    inlineStyleFn: styles => {
      //SUBSCRIPT
      //SUPERSCRIPT
      let element = 'span'
      let key1 = 'color-'
      let key2 = 'bgcolor-'
      let key3 = 'fontsize-'
      let key4 = 'fontfamily-'
      let key5 = 'SUBSCRIPT'
      let key6 = 'SUPERSCRIPT'

      let color = styles.filter(value => value.startsWith(key1)).first()
      let bgcolor = styles.filter(value => value.startsWith(key2)).first()
      let fontsize = styles.filter(value => value.startsWith(key3)).first()
      let fontfamily = styles.filter(value => value.startsWith(key4)).first()
      let SUBSCRIPT = styles.filter(value => value.startsWith(key5)).first()
      let SUPERSCRIPT = styles.filter(value => value.startsWith(key6)).first()

      let style = {}
      if (color) {
        style = { ...style, color: color.replace(key1, '') }
      }

      if (bgcolor) {
        style = { ...style, backgroundColor: bgcolor.replace(key2, '') }
      }

      if (fontsize) {
        style = { ...style, fontSize: fontsize.replace(key3, '') }
      }

      if (fontfamily) {
        style = { ...style, fontFamily: fontfamily.replace(key4, '') }
      }

      if (SUBSCRIPT) {
        element = 'sub'
      }
      if (SUPERSCRIPT) {
        element = 'sup'
      }

      return {
        element,
        style
      }
    }
  }

  return (
    <ReactDraftWysiwyg
      editorState={value}
      onEditorStateChange={data => {
        setValue(data)
        const content = data.getCurrentContent()

        const html = stateToHTML(content, options)
        setHtmlBody(html)
      }}
    />
  )
}

export default EditorControlled
