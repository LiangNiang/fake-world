# Fake-World

[English](./README.en.md) | 简体中文

<!-- PROJECT SHIELDS -->

[![Stargazers][stars-shield]][stars-url]
[![Fork][forks-shield]][fork-url]
[![GPL License][license-shield]][license-url]

<br />

<p align="center">
  <a href="https://fake-world.devdoll.icu/">
    <img src="showcase/favicon.svg" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">高仿的移动端微信</h3>
  <br />
  <p align="center">
    复刻了微信的多种界面、功能：通讯录、发送编辑朋友圈、发送各种类型的消息（文本、图片、转账、红包、消息间引用、语音）、钱包、交易记录等等
    <br />
    支持进入编辑模式进行所见即所得的修改（shift + z），同时浏览器端可以直接截图
    <br />
    <br />
    <a href="https://fake-world.devdoll.icu/">查看项目</a>
    ·
    <a href="https://github.com/LiangNiang/fake-world/issues">报告Bug</a>
    ·
    <a href="https://github.com/LiangNiang/fake-world/issues">提出新特性</a>
  </p>
</p>

## 目录

- [showcase](#showcase)
- [推荐插件](#推荐插件)
- [主要技术栈](#主要技术栈)
- [用户数据声明](#用户数据声明)
- [开发指南](#开发指南)
- [贡献者](#贡献者)
- [版权说明](#版权说明)

### showcase

<!-- ![showcase1](assets/case1.png)![showcase2](assets/case2.png) -->
<div style="display:inline-block">
  <img src="showcase/case1.png" alt="showcase1" width="200" height="400">
  <img src="showcase/case2.png" alt="showcase2" width="200" height="400">
  <img src="showcase/case6.png" alt="showcase6" width="200" height="400">
  <img src="showcase/case3.png" alt="showcase3" width="200" height="400">
  <img src="showcase/case4.png" alt="showcase4" width="200" height="400">
  <img src="showcase/case5.png" alt="showcase5" width="200" height="400">
</div>

### 推荐插件

Windows下可以使用一个 Chrome 插件来替换网页字体为苹方 [字体换成苹方](https://chromewebstore.google.com/detail/%E5%AD%97%E4%BD%93%E6%8D%A2%E6%88%90%E8%8B%B9%E6%96%B9/pogfdgfepibcifimpojbacaolamhbjde)

还可以搭配 [mactype](https://github.com/snowie2000/mactype) 来实现更好的效果

### 主要技术栈

由衷感谢下列相关技术、项目的贡献者：

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

### 用户数据声明

本项目默认不会收集用户数据，所有数据包括图片均存储在浏览器端，不会上传到服务器，也不会向任何第三方发送数据。

本项目接入了 [Microsoft Clarity](https://clarity.microsoft.com/)，用于收集用户行为数据，但不会收集任何个人信息，仅用于改进用户体验。

### 开发指南

#### 前置依赖

* [Node.js](https://nodejs.org/en)
* [pnpm](https://pnpm.io/)
* [docker](https://www.docker.com/) 可选
* [docker-compose](https://docs.docker.com/compose/) 可选

Node.js 使用最新的 LTS 版本即可，同时本项目使用了 [pnpm](https://pnpm.io/) 来做 monorepo，请先确保您已经安装了 pnpm，可以方便的使用 [corepack](https://github.com/nodejs/corepack) 来使用包管理工具
```bash
corepack enable
```

```bash
# clone project
git clone https://github.com/LiangNiang/fake-world.git
cd fake-world
# 安装依赖
pnpm install
```

#### 启动前端项目

```bash
pnpm run dev:web

```
#### 启动后端项目 （非必需）

在 packages/apis/.env.local 中配置相关环境变量信息，写入如下内容

```
PORT=9000
OPENAI_baseURL=
OPENAI_apiKey=
OPENAI_model=
```
这些环境变量都不是必需的，PORT 是后端服务占用的端口号，默认为 9000，OPENAI 相关的环境变量如果需要调试相关 AI 功能，可以自行填入。


然后在项目根目录执行
```bash
pnpm run dev:api 
# 或者在 packages/api 执行
pnpm run dev
```

### 贡献者

liangniangbaby@gmail.com

### 版权说明

该项目签署了 GPL v3.0 授权许可，详情请参阅 [LICENSE][license-url]


[stars-shield]: https://img.shields.io/github/stars/LiangNiang/fake-world?style=flat-square
[stars-url]: https://github.com/LiangNiang/fake-world/stargazers
[forks-shield]: https://img.shields.io/github/forks/LiangNiang/fake-world?style=flat-square
[fork-url]: https://github.com/LiangNiang/fake-world/forks
[license-shield]: https://img.shields.io/github/license/LiangNiang/fake-world?style=flat-square
[license-url]: https://github.com/LiangNiang/fake-world/blob/main/LICENSE