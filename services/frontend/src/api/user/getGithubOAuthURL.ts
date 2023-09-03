export const getGitHubOAuthURL = () => {
  const rootUrl = 'https://github.com/login/oauth/authorize'

  const options = {
    client_id: import.meta.env.VITE_GITHUB_CLIENT_ID as string,
    redirect_uri: import.meta.env[
      'VITE_GOOGLE_OAUTH_REDIRECT_URL_' + import.meta.env.MODE
    ] as string,
  }

  const qs = new URLSearchParams(options)

  return `${rootUrl}?${qs.toString()}`
}
