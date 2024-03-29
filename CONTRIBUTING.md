# Contributing to Metabolic Atlas

Thank you for taking your time in contributing to Metabolic Atlas!

In this guide you will get overview of the contribution workflow from opening an issue, creating a PR (Pull Request), reviewing, and merging the PR.

## Creating a new issue

If you spot a problem with the website or have any kind of suggestions, search if an issue already exists. If a related issue doesn't exist, please [create a new issue](https://github.com/MetabolicAtlas/MetabolicAtlas/issues/new/choose). Use a suitable issue template, e.g. bug report or feature request, or create a blank issue with a description as following:

_As a TYPE_OF_USER, I want to ACCOMPLISH_A_GOAL, so that I REASON_FOR_ACCOMPLISHING_GOAL._

For example: _As a developer, I would like to have a Contribution Guidelines document available, so that I can learn how to contribute to Metabolic Atlas._

If possible, please also add Acceptance Criteria so it is clear what is required for the issue to be considered completed.

## Making Changes

The production website, https://metabolicatlas.org, is based on the `main` branch. All new development should be based on this branch.

### Getting Started

To get started with running the project on your local development machine, please follow the [README](https://github.com/MetabolicAtlas/MetabolicAtlas/blob/main/README.md)

### Creating a branch

Once you have the project running locally, create a new branch based on the `main` branch. The branch name should start with `feat/` or `fix/` (inspired by the [Semantic Commit Messages](https://www.conventionalcommits.org/en/v1.0.0/)) and have a relatively short dash-separated name, for example `feat/contribution-guidelines`.

### Adding a commit

When you are ready to commit the changes, please write a commit message based on [Semantic Commit Messages](https://www.conventionalcommits.org/en/v1.0.0/). For example: `docs: add contribution guidelines`.

#### [Recommended] Setup commit hooks

The project (`frontend` and `api`) uses `eslint` and `prettier` to help catch errors and format code. Some pre-commit actions are provided along with the project that runs the linter and formatter before finalizing each commit. To setup the pre and post commit hooks, please run the following:

```bash
git config core.hooksPath git_hooks
```

Note that the project needs to be running (`start-stack`) for the commit hooks to work since they are executing commands through docker.

#### [Optional] Text editor integration for eslint

Many text editors have support for integrating `eslint` and `prettier`. For `eslint`, the editor could show inline warnings and errors live. For `prettier`, the editor can auto-format the code whenever a file is saved.

##### prettier

Prettier relies on the `.prettierrc.json` file, which is provided by default in the project. Please refer to the plugin documentation for more information on how to set them up. For example: [ale](https://github.com/dense-analysis/ale) and [coc.nvim](https://github.com/neoclide/coc.nvim) for Vim or [the Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for Visual Studio Code.

##### eslint

To enable the `eslint` integrations, the text editor needs to have access to the `node_modules` folder. Since the project runs in Docker, the `node_modules` are not mounted to the local file system by default for performance reasons. Therefore, to enable text editor integrations, the `node_modules` folder needs to be mounted, which can be done by making the following changes (this is for `/frontend`, but it can also be added to `/api` for the same effect) in `docker-compose-local.yml`.

Under `frontend:`:

- change `command:` from `yarn serve` to `yarn && yarn serve`.
- under `volumes:`, add a new line: `- ./frontend/node_modules:/project/node_modules`

After these changes, make sure to run `start-stack` again to mount the `node_modules` to the local file system. Please note that the project might take longer to start as this is a resource intensive process, which is also why this is not provided by default.

Once the `node_modules` are mounted to the local file system, the text editor integration should work as normal. Please refer to the plugin documentation for more information on how to set them up. For example: [ale](https://github.com/dense-analysis/ale) and [coc.nvim](https://github.com/neoclide/coc.nvim) for Vim or [the ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for Visual Studio Code.

**Important**: please make sure that these changes you make in the `docker-compose-local.yml` file are not checked into git.

### Creating a PR

1. When you are finished with the changes, [initiate a new PR](https://github.com/MetabolicAtlas/MetabolicAtlas/compare) from your branch with `main` as the base branch.
2. The PR title should also follow the style of Semantic Commit Messages, for example `docs: add contribution guidelines`.
3. The PR description should include which corresponding issue it closes, as well as any instructions for how reviewers can verify the PR. For example:
   > This PR closes #682.
   >
   > Please refer to the ./CONTRIBUTING.md file and let me know if you have any suggestions for changes.
4. After you have filled in the PR title and description, please tag the Core Team as reviewers. Currently the Core Team members are:
   - [e0](https://github.com/e0)
   - [inghylt](https://github.com/inghylt)
   - [mihai-sysbio](https://github.com/mihai-sysbio)
   - [MalinAhlberg](https://github.com/MalinAhlberg)
   - [nanjiangshu](https://github.com/nanjiangshu)
5. Once you are happy with everything, click on "Create pull request".

### Merging a PR

After you have created the PR, merging initially appears as blocked. Please wait until at least two Core Team members have approved your PR, at which point you can click the "Merge pull request" button on the PR page. Once you have merged the PR, please delete the feature branch.

If any reviewer requests changes to your PR, please resolve the changes with new commits if possible. Once you are done, go to the PR page and re-request reviews from the relevant reviewers. **It is the PR author's responsibility to merge the PR.**

### Reviewing a PR

In an effort to prevent PRs from being ignored, a PR should not take longer than 2 weeks to be resolved (merged or rejected). If there has been no activity after 2 weeks, please feel free to ping the reviewers by adding a new message on the PR page.

When reviewing a PR, please add [suggestions](https://docs.github.com/en/github/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/incorporating-feedback-in-your-pull-request#applying-a-suggested-change) and/or comments to the accompanying changed files. Try to be thorough and include all of the comments in a single review session instead of sprinkling comments and feedback over different periods of time. This makes it much easier for the PR author to address the potential changes.

If you have added a suggestion and/or feedback, please resolve it as soon as possible after the PR author has addressed it. **It is the reviewer's responsibility to resolve suggestions/comments.**

### Your PR is merged!

Congratulations! Thank you again for taking time to contribute to Metabolic Atlas!
