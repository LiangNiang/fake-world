# Fake-World

[简体中文](./README.md) | English

<!-- PROJECT SHIELDS -->

[![Stargazers][stars-shield]][stars-url]
[![Fork][forks-shield]][fork-url]
[![GPL License][license-shield]][license-url]

<br />

<p align="center">
  <a href="https://fake-world.devdoll.icu/">
    <img src="showcase/favicon.svg" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">WeChat Mobile Clone</h3>
  <br />
  <p align="center">
    A replica of various WeChat interfaces and features: contacts, moments posting and editing, various message types (text, images, transfers, red packets, message quotes, voice), wallet, transaction records, and more
    <br />
    Supports entering edit mode for WYSIWYG modifications (shift + z), with direct screenshot capability in browser
    <br />
    <br />
    <a href="https://fake-world.devdoll.icu/">View Demo</a>
    ·
    <a href="https://github.com/LiangNiang/fake-world/issues">Report Bug</a>
    ·
    <a href="https://github.com/LiangNiang/fake-world/issues">Request Feature</a>
  </p>
</p>

## Table of Contents

- [Showcase](#showcase)
- [Recommended Plugins](#recommended-plugins)
- [Tech Stack](#tech-stack)
- [User Data Statement](#user-data-statement)
- [Development Guide](#development-guide)
- [Contributors](#contributors)
- [License](#license)

### Showcase

<div style="display:inline-block">
  <img src="showcase/case1.png" alt="showcase1" width="200" height="400">
  <img src="showcase/case2.png" alt="showcase2" width="200" height="400">
  <img src="showcase/case6.png" alt="showcase6" width="200" height="400">
  <img src="showcase/case3.png" alt="showcase3" width="200" height="400">
  <img src="showcase/case4.png" alt="showcase4" width="200" height="400">
  <img src="showcase/case5.png" alt="showcase5" width="200" height="400">
</div>

### Recommended Plugins

For Windows users, you can use a Chrome extension to replace web fonts with PingFang: [Change Font to PingFang](https://chromewebstore.google.com/detail/%E5%AD%97%E4%BD%93%E6%8D%A2%E6%88%90%E8%8B%B9%E6%96%B9/pogfdgfepibcifimpojbacaolamhbjde)

You can also use [mactype](https://github.com/snowie2000/mactype) for better results

### Tech Stack

Sincere thanks to the contributors of the following technologies and projects:

* [Vite](https://vitejs.dev/)
* [React](https://react.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwindcss](https://tailwindcss.com/)
* [Jotai](https://jotai.org/)
* [Slate](https://www.slatejs.org/)
* [Dexie.js](https://dexie.org/)
* [Bun](https://bun.sh/)
* [ElysiaJS](https://elysiajs.com/)
* [Vercel AI SDK](https://sdk.vercel.ai/)

### User Data Statement

This project does not collect user data by default. All data, including images, is stored in the browser and will not be uploaded to servers or shared with any third parties.

The project integrates [Microsoft Clarity](https://clarity.microsoft.com/) for collecting user behavior data, but it does not collect any personal information and is only used to improve user experience.

### Development Guide

#### Prerequisites

* [Node.js](https://nodejs.org/en)
* [pnpm](https://pnpm.io/)
* [docker](https://www.docker.com/) (optional)
* [docker-compose](https://docs.docker.com/compose/) (optional)

Use the latest LTS version of Node.js. This project uses [pnpm](https://pnpm.io/) for monorepo management. Make sure you have pnpm installed. You can easily use [corepack](https://github.com/nodejs/corepack) to manage package managers:
```bash
corepack enable
```

```bash
# clone project
git clone https://github.com/LiangNiang/fake-world.git
cd fake-world
# install dependencies
pnpm install
```

#### Start Frontend Project

```bash
pnpm run dev:web
```

#### Start Backend Project (Optional)

Configure environment variables in packages/apis/.env.local:

```
PORT=9000
OPENAI_baseURL=
OPENAI_apiKey=
OPENAI_model=
```
These environment variables are not required. PORT is the backend service port (default 9000). OPENAI-related variables can be filled in if you need to debug AI features.

Then run in the project root directory:
```bash
pnpm run dev:api 
# or in packages/api directory
pnpm run dev
```

### Contributors

liangniangbaby@gmail.com

### License

This project is licensed under GPL v3.0 - see the [LICENSE][license-url] file for details


[stars-shield]: https://img.shields.io/github/stars/LiangNiang/fake-world?style=flat-square
[stars-url]: https://github.com/LiangNiang/fake-world/stargazers
[forks-shield]: https://img.shields.io/github/forks/LiangNiang/fake-world?style=flat-square
[fork-url]: https://github.com/LiangNiang/fake-world/forks
[license-shield]: https://img.shields.io/github/license/LiangNiang/fake-world?style=flat-square
[license-url]: https://github.com/LiangNiang/fake-world/blob/main/LICENSE 