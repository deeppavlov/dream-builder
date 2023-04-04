export const submitOnEnter = (
  e: React.KeyboardEvent,
  deps: any,
  func: () => void
) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    deps && func()
  }
}
