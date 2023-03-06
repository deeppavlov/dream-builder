export const generateRoutingName = (name: string) =>
  name?.replace(/\s+/g, '_').toLowerCase()
