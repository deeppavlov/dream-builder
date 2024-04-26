export const RoutesList = {
  start: '/',
  botsAll: '/allbots',
  yourBots: '/yourbots',
  code: '/code',
  editor: {
    default: '/:name',
    skills: '/:name/skills?',
    architecture: '/:name/architecture',
    integration: '/:name/integration',
    skillEditor: '/:name/skills/:skillId',
  },
  distributions: '/distributions',
  skills: '/skills',
  skillsAll: '/allskills',
  yourSkills: '/yourskills',
  // Dev routes
  admin: {
    default: '/admin',
    requests: '/admin/requests?',
    users: '/admin/users',
  },
} as const
