import axios from 'axios'

export async function getSkillListByDistName(distName: string) {
  const { data } = await axios.get(
    `https://alpha.deepdream.builders:6998/api/skills/${distName}`,
    {
      headers: {
        token:
          'eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxM2ZkNjhjOTY2ZTI5MzgwOTgxZWRjMDE2NGEyZjZjMDZjNTcwMmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2Njg1MDI0NzUsImF1ZCI6IjIwNzA4MTc0MzY5OC1pbm1mcG44Zm5ycW50ajRlbTIyOTh0YzV2ZGY0Z3B0bS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNTc4Nzk3NDc3MTIzNTc0NTU3NSIsImVtYWlsIjoia2xsbW50dkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiMjA3MDgxNzQzNjk4LWlubWZwbjhmbnJxbnRqNGVtMjI5OHRjNXZkZjRncHRtLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibmFtZSI6ItCQ0YDRgtC10Lwg0JrQu9C10LzQtdC90YLRjNC10LIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUxtNXd1MEVMUTdoYXE4ekxyOVdvVlZiM2tfZTYtdDEwaWM1a05yZURsbnoxUT1zOTYtYyIsImdpdmVuX25hbWUiOiLQkNGA0YLQtdC8IiwiZmFtaWx5X25hbWUiOiLQmtC70LXQvNC10L3RgtGM0LXQsiIsImlhdCI6MTY2ODUwMjc3NSwiZXhwIjoxNjY4NTA2Mzc1LCJqdGkiOiI0MDMzM2Y1OGEyODE0OTNiMTc5ZDcwYzBkYzc2ZTczZmNlN2ZjNWMzIn0.zFJMDVoNZ8esvBNoN03iTSDfRHDx9lU6csY698Q6mppVdAAcGQ86PzpyMejw7u5H1kDHuA5Jlcx6MDneS2LI4JbrDOK795z2nCG_v5TXWYNpLw0Eg9PU3NnjPfr2p8LheHX1fNA7oBsqxqiKxuRb1jZKoXs4JmP3-tZrIhC9gqEjTUU-Q8u5pLYmjs44_I4KA6kNWihqWdEDFGcAcuzz4xWs1zy_WofRRE4WONm_f6tpiBVE2z_a-5kIcdfuBzvvLFUDBDzud1Hk4tom0Woz67auHOG_TnaNDyjLXWPtJGg9Hxqryw0wQfmrw4HtXWga9O41K7uwyHkVUPRMojOdEQ',
      },
    }
  )
  return data
}
