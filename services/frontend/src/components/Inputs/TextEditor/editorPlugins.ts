import { CompletionContext } from '@codemirror/autocomplete'
import {
  Decoration,
  EditorView,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
  hoverTooltip,
} from '@uiw/react-codemirror'

export const inputDecoration = ViewPlugin.fromClass(
  class {
    placeholders

    constructor(view: EditorView) {
      this.placeholders = placeholderInput.createDeco(view)
    }

    update(update: ViewUpdate) {
      this.placeholders = placeholderInput.updateDeco(update, this.placeholders)
    }
  },
  {
    decorations: v => v.placeholders,
    provide: plugin =>
      EditorView.atomicRanges.of(view => {
        return view.plugin(plugin)?.placeholders || Decoration.none
      }),
  }
)

const placeholderInput = new MatchDecorator({
  regexp: /\[YOUR INPUT]|\[ВВЕДИТЕ ДАННЫЕ]/g,
  decoration: match =>
    Decoration.replace({
      widget: new PlaceholderWidget(match[0]),
    }),
})

const blockNames = [
  'YOUR PERSONALITY',
  'TASK',
  'CONTEXT ABOUT HUMAN',
  'INSTRUCTION',
  'EXAMPLE',
]

const getBlockNameRegEx = (keywords: string[]) => {
  const mergedKeywords = keywords.join('|')
  return new RegExp(`(?<=\\s|^)(${mergedKeywords})(?=)`, 'g')
}

export const titleDecoration = ViewPlugin.fromClass(
  class {
    placeholders

    constructor(view: EditorView) {
      this.placeholders = placeholderTitle.createDeco(view)
    }

    update(update: ViewUpdate) {
      this.placeholders = placeholderTitle.updateDeco(update, this.placeholders)
    }
  },
  {
    decorations: v => v.placeholders,
    provide: plugin =>
      EditorView.atomicRanges.of(view => {
        return view.plugin(plugin)?.placeholders || Decoration.none
      }),
  }
)

const placeholderTitle = new MatchDecorator({
  regexp: getBlockNameRegEx(blockNames),
  decoration: (match: RegExpExecArray) =>
    Decoration.replace({
      widget: new PlaceholderWidget(match[0]),
    }),
})

class PlaceholderWidget extends WidgetType {
  label: string
  constructor(label: string) {
    super()
    this.label = label
  }

  eq(other: PlaceholderWidget): boolean {
    return other.label === this.label
  }

  toDOM() {
    const wrap = document.createElement('span')

    const arrValues = ['[YOUR INPUT]', '[ВВЕДИТЕ ДАННЫЕ]']

    wrap.className = arrValues.includes(this.label)
      ? 'widget-input'
      : 'widget-title'
    wrap.innerHTML = this.label
    return wrap
  }
}

const completions = [
  { label: 'panic', type: 'keyword' },
  { label: 'park', type: 'constant', info: 'Test completion' },
  { label: 'password', type: 'variable' },
]

export const myAutocomplete = (context: CompletionContext) => {
  const before = context.matchBefore(/\w+/)
  if (context.explicit && !before) {
    return null
  }
  return {
    from: before ? before.from : context.pos,
    options: completions,
    validFor: /^\w*$/,
  }
  //autocompletion({ override: [myAutocomplete] }),
}

export const wordHover = hoverTooltip((view, pos, side) => {
  let { from, to, text } = view.state.doc.lineAt(pos)
  let start = pos,
    end = pos
  while (start > from && /\w/.test(text[start - from - 1])) start--
  while (end < to && /\w/.test(text[end - from])) end++
  const word =
    start - from === end - from ? text.slice(start - from, end - from + 12) : ''
  if (word !== '[YOUR INPUT]') {
    return null
  }
  return {
    pos: start,
    end,
    above: true,
    create() {
      let dom = document.createElement('div')
      dom.textContent = 'вместо [YOUR INPUT] укажите свое значение'
      return { dom }
    },
  }
})
