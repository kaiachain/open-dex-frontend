[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

# NO LONGER MAINTAINED

Since the launch of Kaia Blockchain this repository has been parked in favour of the new open-source projects in [Kaia's Github](https://github.com/kaiachain). Contributors have now moved there continuing with massive open-source contributions to our blockchain ecosystem. A big thank you to everyone who has contributed to this repository. For more information about Klaytn's chain merge with Finschia blockchain please refer to the launching of Kaia blockchain - [kaia.io](http://kaia.io/).

---

# Klaytn-DEX Frontend Documentation

Here you can find Klaytn-DEX frontend documentation:

- [User Guide](docs/guide.md) provides instructions on how to interact with Klaytn-DEX 
- [Frontend Specification](docs/modules.md) describes the Klaytn-DEX module structure
- [Deployment Guide](docs/deploy.md) provides instructions on how to deploy Klaytn-DEX

## Local Development

```bash
pnpm i

# run dev server
pnpm dev

# run unit tests in watch mode
pnpm vitest

# open cypress
pnpm cy

# fix formatting
pnpm format:fix

# static analysis
pnpm typecheck
pnpm lint
```

## CI/CD

First of all, create `.env.local` file. Use `.env.example` as a reference.

Commands:

```bash
pnpm i

# check code formatting
pnpm format:check

# run static analysis
pnpm typecheck
pnpm lint

# run both unit & component tests
pnpm test

# build
pnpm build
```

## Want to Contribute ? <a id="want-to-contribute"></a>

In line with our commitment to decentralization, all Klaytn codebase and its documentations are completely open source. Klaytn always welcomes your contribution. Anyone can view, edit, fix its contents and make suggestions. You can either create a pull request on GitHub or create a enhancement request. Make sure you check out our guidelines before contributing:

- [Contribution Guide](./CONTRIBUTING.md)
- [License](./LICENSE)
- [Code of Conducts](./code-of-conduct.md)
