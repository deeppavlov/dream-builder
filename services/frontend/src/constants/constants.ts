export const DEBUG_DIST = 'universal_prompted_assistant'
export const DEEPY_ASSISTANT = 'deepy_assistant'
export const TOOLTIP_DELAY = 1000
export const OPEN_AI_LM = 'OpenAI'

enum DeployInProgress {
  'STARTED',
  'CREATING_CONFIG_FILES',
  'PUSHING_IMAGES',
  'DEPLOYED',
}
