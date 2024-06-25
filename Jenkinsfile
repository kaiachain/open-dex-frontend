@Library('jenkins-library' ) _

def pipeline = new org.js.AppPipeline(
    steps: this,
    buildDockerImage: 'build-tools/node:16-pnpm7',
    dockerImageName: 'kaiachain/kaia-frontend',
    dockerRegistryCred: 'bot-kaia-rw',
    npmRegistries: [:],
    packageManager: 'pnpm',
    testCmds: ['cp dex-config.example.json dex-config.json','pnpm format:check','pnpm lint','pnpm typecheck','pnpm test'],
    buildCmds: ['cp dex-config.example.json dex-config.json','pnpm build'],
    sonarProjectName: 'kaia-frontend',
    sonarProjectKey: 'jp.co.soramitsu:kaia-frontend',
    gitUpdateSubmodule: true)
pipeline.runPipeline()
