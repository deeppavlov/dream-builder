export const RoutesList = {
  start: '/',
  botsAll: '/allbots',
  yourBots: '/yourbots',
  profile: '/profile',
  code: '/code',
  editor: {
    default: '/:name',
    skills: '/:name/skills?',
    architecture: '/:name/architecture',
    skillEditor: '/:name/skills/:skillId',
  },
  distributions: '/distributions',
  skills: '/skills',
  skillsAll: '/allskills',
  yourSkills: '/yourskills',
  // Dev routes
  draft: '/draft',
  test: '/test',
  sandbox: '/sandbox',
} as const
