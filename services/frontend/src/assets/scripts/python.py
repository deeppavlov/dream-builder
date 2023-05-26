import requests


# Endpoint 1: Create dialog session
def create_dialog_session(assistant_name):
    url = 'https://hostname/api/dialog_sessions'
    payload = {
        'virtual_assistant_name': 'assistantName',
    }

    response = requests.post(url, json=payload)
    data = response.json()
    dialog_session_id = data['id']
    print('Dialog session ID:', dialog_session_id)
    return dialog_session_id


# Endpoint 2: Send a chat message
def send_chat_message(dialog_session_id, your_message, openai_api_key):
    url = f'https://hostname/api/dialog_sessions/{str(dialog_session_id)}/chat'
    payload = {
        'text': your_message,
        'openai_api_key': openai_api_key,
    }

    response = requests.post(url, json=payload)
    data = response.json()
    assistant_message = data["text"]
    print('Assistant message:', assistant_message)
    # Handle the response data as needed


# Endpoint 3: Get dialog session history
def get_dialog_session_history(dialog_session_id):
    url = f'https://hostname/api/dialog_sessions/{dialog_session_id}/history'

    response = requests.get(url)
    data = response.json()
    # Handle the response data as needed


# Usage example

assistant_name = 'assistantName'
your_message = 'What is machine learning??'
openai_api_key = 'your-api-key'

dialog_session_id = create_dialog_session(assistant_name) # or replace with the actual dialog session ID
send_chat_message(dialog_session_id, your_message, openai_api_key)
get_dialog_session_history(dialog_session_id)