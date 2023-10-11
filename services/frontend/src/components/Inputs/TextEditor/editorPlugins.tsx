import { Decoration, EditorView, MatchDecorator, ViewPlugin, WidgetType } from '@uiw/react-codemirror';

export const inputDecoration = ViewPlugin.fromClass(
  class {
    placeholders

    constructor(view: any) {
      this.placeholders = placeholderInput.createDeco(view)
    }

    update(update: any) {
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
  regexp: /\[YOUR INPUT]/g,
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

    constructor(view: any) {
      this.placeholders = placeholdeTitle.createDeco(view)
    }

    update(update: any) {
      this.placeholders = placeholdeTitle.updateDeco(update, this.placeholders)
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

const placeholdeTitle = new MatchDecorator({
  regexp: getBlockNameRegEx(blockNames),
  decoration: match =>
    Decoration.replace({
      widget: new PlaceholderWidget(match[0]),
    }),
})

class PlaceholderWidget extends WidgetType {
  label: string
  constructor(label: any) {
    super()
    this.label = label
  }

  eq(other: any) {
    return other.label === this.label
  }

  toDOM() {
    const wrap = document.createElement('span')
    wrap.className =
      this.label === '[YOUR INPUT]' ? 'widget-input' : 'widget-title'
    wrap.innerHTML = this.label
    return wrap
  }
}

const completions = [
  { label: 'panic', type: 'keyword' },
  { label: 'park', type: 'constant', info: 'Test completion' },
  { label: 'password', type: 'variable' },
]

export const myAutocomplete = (context: any) => {
  let before = context.matchBefore(/\w+/)
  if (context.explicit && !before) {
    return null
  }
  return {
    from: before ? before.from : context.pos,
    options: completions,
    validFor: /^\w*$/,
  }
}
