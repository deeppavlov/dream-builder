# Create dialog session using assistant name and get configuration

curl -X 'POST' 
  'http://hostname/api/dialog_sessions' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "virtual_assistant_name": "assistantName"
}'

# Send message

curl -X 'POST' 
  'http://hostname/api/dialog_sessions/$your_dialog_session_id/chat' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "text": $your_message,
  "openai_api_key": $your_open_api_key
}'

# Get chat history

curl -X 'GET' 
  'http://hostname/api/dialog_sessions/$your_dialog_session_id/history' \
  -H 'accept: application/json' 
  

