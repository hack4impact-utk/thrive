# THRIVE

<h1 align="center">
  <br>
    <img width="25%" height="280" alt="thrive logo" src="https://github.com/user-attachments/assets/2a0d17be-c3cf-4fe6-8505-3b9ff3a4e8cf" />
  <br>
</h1>

## Description

This project is built for Thrive, a Knoxville-based nonprofit that connects caring adults with at-risk youth through gospel-centered relationships. The platform streamlines volunteer recruitment, scheduling, communication, and reporting—helping Thrive staff and mentors focus on what matters most: transforming communities through faith, service, and relationship.

## Getting Started

### Prerequisites

Please have the following installed on your machine:

- Node.js
- PNPM
- VSCode

Please have the following VSCode extensions installed:

- Prettier
- ESLint
- Code Spell Checker
- markdownlint

### Environment Variables

Create a `.env` file in the root directory of the project and add the following variables:

```text
DB_CONNECTION_STRING=

EXAMPLE_ENV_VAR=example-value
EXAMPLE_ENV_VAR_2=example-value-2
PRIVATE_ENV_VAR=
PRIVATE_ENV_VAR_2=
```

Please contact leadership to obtain the following:

- DB_CONNECTION_STRING
- PRIVATE_ENV_VAR
- PRIVATE_ENV_VAR_2

### Running the App

1. Run `pnpm install` to install the dependencies.
2. Run `pnpm run dev` to start the development server.

### Contributing

Branch protections are enabled on this repository.
To contribute, please create a new branch and make a pull request.
The rules for branch names are lax, just be sure to include your name.

An example branch name for a card that adds a reset password email would be:

```text
agustin-reset-password-email
```

Your pull request title must follow the conventional commits specification. An example of a valid pull request title is:

```text
feat: Add pending form submissions table
```

### Testing

#### Debugging

The `.vscode/launch.json` file is configured to run Next.js in debug mode. This can let you step through your code line by line and inspect variables.
To start debug mode, navigate to the `Run and Debug` tab in VSCode, select the mode, and click the green play button.
