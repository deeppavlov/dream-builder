import classNames from 'classnames/bind'
import { FC, useEffect, useRef } from 'react'
import s from './PromptHighlighter.module.scss'

export type IHighlights = Array<{
  keyword: string
  color: string
}>

interface IProps {
  highlights: IHighlights
  text: string
  className?: string
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>
}

export const PromptHighlighter: FC<IProps> = ({
  highlights,
  text,
  className,
  textAreaRef,
}) => {
  const highlightsRef = useRef<HTMLDivElement>(null)
  var ua = window.navigator.userAgent.toLowerCase()
  var isIE = !!ua.match(/msie|trident\/7|edge/)
  var isWinPhone = ua.indexOf('windows phone') !== -1
  var isIOS = !isWinPhone && !!ua.match(/ipad|iphone|ipod/)
  let cx = classNames.bind(s)

  const getAllKeywordsRegExp = () => {
    const keywords = highlights.map(({ keyword }) => keyword).join('|')
    return new RegExp(`(?<!<[^>]*|&[^;]*)(?<=\\[)(${keywords})(?=\\])`, 'g')
  }

  const getHighligthElement = (color: string, match: string) =>
    `<mark style='background-color: ${color}'>${match}</mark>`

  const handleKeywordMatch = (match: string): string => {
    const matchedElement = highlights.filter(
      ({ keyword }) => keyword === match
    )?.[0]

    if (!matchedElement) return match
    return getHighligthElement(matchedElement.color, match)
  }

  const applyHighlights = (text: string) => {
    let regExp = getAllKeywordsRegExp()
    let highlightedText = text
      .replace(/\n$/g, '\n\n')
      .replace(regExp, handleKeywordMatch)

    if (isIE) {
      // IE wraps whitespace differently in a div vs textarea, this fixes it
      highlightedText = highlightedText.replace(/ /g, ' <wbr>')
    }

    return highlightedText
  }

  function updateHighlight() {
    const isText = text !== undefined && text.length > 0
    const highlightElement = highlightsRef?.current

    if (!highlightElement) return
    if (!isText) {
      highlightElement.innerHTML = ''
      return
    }
    const highlightedText = applyHighlights(text)
    highlightElement.innerHTML = highlightedText
  }

  function handleScroll(e: Event) {
    const highlightElement = highlightsRef?.current
    const textareaElement = e.target as HTMLTextAreaElement | null

    if (!highlightElement || !textareaElement) return
    highlightElement.scrollTop = textareaElement.scrollTop
    highlightElement.scrollLeft = textareaElement.scrollLeft
  }

  function fixIOS() {
    const highlightElement = highlightsRef?.current

    if (!highlightElement) return
    // iOS adds 3px of (unremovable) padding to the left and right of a textarea, so adjust highlights div to match
    const paddingLeft = parseInt(highlightElement.style.paddingLeft)
    const paddingRight = parseInt(highlightElement.style.paddingRight)
    highlightElement.style.paddingLeft = paddingLeft + 3 + 'px'
    highlightElement.style.paddingLeft = paddingRight + 3 + 'px'
  }

  useEffect(() => {
    const isHighlightElement = highlightsRef?.current !== null

    if (!isHighlightElement || !textAreaRef?.current) return
    if (isIOS) fixIOS()

    textAreaRef.current.onscroll = handleScroll
    updateHighlight()
  }, [text, highlightsRef?.current, textAreaRef?.current])

  return <div className={cx(s.highlights, className)} ref={highlightsRef}></div>
}
