const core = require('@actions/core')
const github = require('@actions/github')
const { filter } = require('lodash')


async function run() {
  if (!github.context.payload.pull_request) {
    core.error('This action is only valid on Pull Requests')
    return
  }

  const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor
  const token = core.getInput('github-token')
  const github = new GitHub(token)

  const { data: files } = await github.pulls.listFiles({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.payload.pull_request.number,
  })

  try {
    const match = core.getInput('match', { required: true })
    const fn = new AsyncFunction('require', 'files', match)
    const result = await fn(require, files)

    console.log(result)
    core.setOutput('files', JSON.stringify(result))
  } catch(err) {
    core.setFailed(err)
  }
}



run()
