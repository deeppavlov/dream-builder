export const scrollSelectionIntoView = () => {
  // Get current selection
  const selection = window.getSelection()

  if (!selection) return

  // Check if there are selection ranges
  if (!selection.rangeCount) {
    return
  }

  // Get the first selection range. There's almost never can be more (instead of firefox)
  const firstRange = selection.getRangeAt(0)

  // Sometimes if the editable element is getting removed from the dom you may get a HierarchyRequest error in safari
  if (firstRange.commonAncestorContainer === document) {
    return
  }

  // Create an empty br that will be used as an anchor for scroll, because it's imposible to do it with just text nodes
  const tempAnchorEl = document.createElement('br')

  // Put the br right after the caret position
  firstRange.insertNode(tempAnchorEl)

  // Scroll to the br. I personally prefer to add the block end option, but if you want to use 'start' instead just replace br to span
  tempAnchorEl.scrollIntoView({
    block: 'end',
  })

  // Remove the anchor because it's not needed anymore
  tempAnchorEl.remove()
}
