import { useEffect } from 'react'
import { openPage, useCurrentPage } from './pagesSlice'
import { useAppDispatch } from '../storeHooks'

const parsePath = (path: string) => path.split("/").filter(s => s !== "")

export default () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const popHandler = (ev?: PopStateEvent) => {
      ev?.preventDefault()
      dispatch(openPage(parsePath(document.location.pathname)))
    }

    window.history.pushState({}, "", window.location.pathname)
    popHandler()
    window.addEventListener('popstate', popHandler)

    return () => window.removeEventListener('popstate', popHandler)
  }, [])

  const currentPage = useCurrentPage()
  const path = "/" + currentPage.join("/")
  useEffect(() => {
    if (path !== window.location.pathname) {
      history.pushState({}, "", path)
    }
  }, [path])
}
