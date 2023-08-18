export const submitOnEnter = (
  e: React.KeyboardEvent,
  deps: any, // leaky | FIX
  func: () => void
) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    deps && func()
  }
}
