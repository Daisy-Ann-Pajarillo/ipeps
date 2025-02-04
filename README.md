<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/IPEPS-PESO/ipeps-frontend">
    <img src="public/Logo Large.png" alt="Logo" width="300" >
  </a>

  <h3 align="center">Iloilo Province Employment Portal and Services with Data Analytics</h3>

  <p align="center">
    Frontend
    <br />
    <a href="https://github.com/IPEPS-PESO/ipeps-frontend"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/IPEPS-PESO/ipeps-frontend/issues">Report Bug</a>
    ·
    <a href="https://github.com/IPEPS-PESO/ipeps-frontend/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#command-prompt-environment-setup">Command Prompt Environment Setup</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

### Built Mainly With

- [React](https://reactjs.org/)
- [React Bootstrap](https://react-bootstrap.github.io/)

See [packages.json](https://github.com/IPEPS-PESO/ipeps-frontend/blob/master/package.json) for complete package list

#### Development Environment

- Windows 10
- [VSCode](https://code.visualstudio.com/)
- [Git Bash](https://git-scm.com/downloads)
- [Windows Terminal](https://docs.microsoft.com/en-us/windows/terminal/get-started)
- [Google Chrome](https://www.google.com/chrome/)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd/related?hl=en)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi/related?hl=en)

#### Linter/Formatter

- [Prettier](https://prettier.io/)

#### VSCode Extensions

- [ES7 React/Redux/GraphQL/React-Native snippets
  ](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

<!-- GETTING STARTED -->

## Getting Started

Requirements:

- Install [NPM 6.14.6](https://www.npmjs.com/package/npm/v/6.14.6)

### Prerequisites

Check your Python version in a command prompt

- Input
  ```sh
  npm --version
  ```
- Output
  ```sh
  6.14.6
  ```

Create a .env.development.local file in the project directory and add the following line

- .env.development.local
  ```sh
  REACT_APP_API_BACKEND_SERVER="http://127.0.0.1:5000/"
  ```

### Command Prompt Environment Setup

1. go to the root directory

   ```sh
   cd ipeps-frontend
   ```

2. Install required packages
   ```sh
   npm install
   ```
3. Start Locally

   ```sh
    npm start
   ```

4. Go to http://localhost:3000/ on your browser
   ```
   http://localhost:3000/
   ```

Docker Notes:

Getting IP for DB IP connection
docker inspect 591c7cc88be9 | grep -E -A 1 "IPAddress|Ports"
