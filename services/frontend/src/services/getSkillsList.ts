import axios from 'axios'

export async function getSkillList() {
  const { data } = await axios.get('http://10.11.1.8:7000/api/skills/')
  return data
}
