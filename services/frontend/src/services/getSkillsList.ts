import axios from 'axios'

export async function getSkillList() {
  const { data } = await axios.get('https://alpha.deepdream.builders:6998/api/skills/')
  return data
}
