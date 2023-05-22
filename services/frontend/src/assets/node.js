const fetch = require('node-fetch')

// Endpoint 1: Create dialog session
const createDialogSession = async () => {
  const url = 'http://hostname/api/dialog_sessions'
  const payload = {
    virtual_assistant_name: 'assistantName',
  }

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  const dialogSessionId = data.dialog_session_id
}

// Endpoint 2: Send a chat message
const sendChatMessage = async (
  dialogSessionId,
  yourMessage,
  openaiApiKey
) => {
  const url = `http://hostname/api/dialog_sessions/${dialogSessionId}/chat`
  const payload = {
    text: yourMessage,
    openai_api_key: openaiApiKey,
  }

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  // Handle the response data as needed
}

// Endpoint 3: Get dialog session history
const getDialogSessionHistory = async dialogSessionId => {
  const url = `http://hostname/api/dialog_sessions/${dialogSessionId}/history`
  const response = await fetch(url)
  const data = await response.json()
  // Handle the response data as needed
}

// Usage example
const dialogSessionId = 42 // Replace with the actual dialog session ID

createDialogSession()
  .then(() => {
  const yourMessage = 'Hello World!'

    const openaiApiKey = 'sk-(the rest of your OpenAI key)'

    return sendChatMessage(
      dialogSessionId,
      yourMessage,
      openaiApiKey
    )
  })
  .then(() => {
    return getDialogSessionHistory(dialogSessionId)
  })
  .catch(error => {
    console.error('Error:', error)
  })
