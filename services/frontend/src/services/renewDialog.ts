import { privateApi } from './axiosConfig'

export async function renewDialog(name: string) {
  const pl = { virtual_assistant_name: name }
  try {
    const { data } = await privateApi.post('dialog_sessions', { ...pl })
    return data
  } catch (e) {
    throw e
  }
}
