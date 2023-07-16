// Endpoint 1: Create dialog session
const createDialogSession = async (virtualAssistantName) => {
  const url = 'https://hostname/api/dialog_sessions'
  const payload = {
    virtual_assistant_name: virtualAssistantName,
  }

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })

  const data = await response.json()
  const dialogSessionId = data.id
  console.log('Dialog session ID:', dialogSessionId)
  return dialogSessionId
}

// Endpoint 2: Send a chat message
const sendChatMessage = async (dialogSessionId, yourMessage, openaiApiKey) => {
  const url = `https://hostname/api/dialog_sessions/${dialogSessionId}/chat`
  const payload = {
    text: yourMessage,
    openai_api_key: openaiApiKey,
  }

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })

  const data = await response.json()
  const assistantMessage = data.text
  console.log('Assistant message:', assistantMessage)
  // Handle the response data as needed
}

// Endpoint 3: Get dialog session history
const getDialogSessionHistory = async (dialogSessionId) => {
  const url = `https://hostname/api/dialog_sessions/${dialogSessionId}/history`
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  })
  const data = await response.json()
  return data
  // Handle the response data as needed
}

// Usage example
const virtualAssistantName = 'assistantName' // assistant must be builded
const yourMessage = 'Hello World!'
const openaiApiKey = 'sk-(the rest of your OpenAI key)'
try {
  const dialogSessionId = await createDialogSession(virtualAssistantName)
  // or replace with the actual dialog session ID

  await sendChatMessage(dialogSessionId, yourMessage, openaiApiKey)

  const history = await getDialogSessionHistory(dialogSessionId)
  console.log(history)
  // Handle the session history data as needed
} catch (error) {
  console.log('Error: ', error)
}
