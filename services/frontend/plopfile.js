import fs from 'fs'

const directoryPath = 'src/components'

const folders = fs
  .readdirSync(directoryPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)

export default function (plop) {
  plop.setGenerator('component', {
    description: 'Generate a new component',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'Select component type:',
        choices: folders,
      },
      {
        type: 'input',
        name: 'name',
        message: 'Enter component name:',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{type}}/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'src/templates/component.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{type}}/{{pascalCase name}}/{{pascalCase name}}.module.scss',
        templateFile: 'src/templates/component.module.scss.hbs',
      },
      // Добавление импорта в index.ts
      {
        type: 'modify',
        path: 'src/components/{{type}}/index.ts',
        pattern: /(import\s*{[^}]*})/,
        template: `import { {{pascalCase name}} } from './{{pascalCase name}}/{{pascalCase name}}';\n$1`,
      },
      // Добавление экспорта в index.ts
      {
        type: 'modify',
        path: 'src/components/{{type}}/index.ts',
        pattern: /(export\s*{)/,
        template: `$1\n  {{pascalCase name}}, `,
      },
    ],
  })
}
