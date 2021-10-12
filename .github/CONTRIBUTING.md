# Contributing to Metabolic Atlas

Thank you for taking your time in contributing to Metabolic Atlas!

In this guide you will get overview of the contribution workflow from opening an issue, creating a PR (Pull Request), reviewing, and merging the PR.

## Creating a new issue

If you spot a problem with the website or have any kind of suggestions, search if an issue already exists. If a related issue doesn't exist, please create a new issue with a description in the following template.

_As a TYPE_OF_USER, I want to ACCOMPLISH_A_GOAL, so that I REASON_FOR_ACCOMPLISHING_GOAL._

For example: _As a developer, I would like to have a Contribution Guidelines document available, so that I can learn how to contribute to Metabolic Atlas._

## Making Changes

The production website, https://metabolicatlas.org, is based on the `main` branch. For development, new work should be based on the `develop` branch.

### Getting Started

To get started with running the project on your local development machine, please follow the [README](https://github.com/MetabolicAtlas/MetabolicAtlas/blob/develop/README.md)

### Creating a branch

Once you have the project running locally, create a new branch based on the `develop` branch. The branch name should start with `feat/` or `fix/` (inspired by the [Semantic Commit Messages](https://www.conventionalcommits.org/en/v1.0.0/)) and have a relatively short dash-separated name, for example `feat/contribution-guidelines`.

### Adding a commit

When you are ready to commit the changes, please write a commit message based on [Semantic Commit Messages](https://www.conventionalcommits.org/en/v1.0.0/). For example: `docs: add contribution guidelines`.

### Creating a PR

1. When you are finished with the changes, [initiate a new PR](https://github.com/MetabolicAtlas/MetabolicAtlas/compare) from your branch with `develop` as the base branch.
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

If you have added a suggestion and/or feedback, please resolve it as soon as possible after the PR author has addressed it. \*\*It is the reviewer's responsibility to resolve suggestions/comments."

### Your PR is merged!

Congratulations! Thank you again for taking time to contribute to Metabolic Atlas!
