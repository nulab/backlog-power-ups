# <img src="icon128.png" width="45"> Backlog Power Ups

> Browser extension - many plugins to power up your [Backlog](https://backlog.com).

## Install

[![Chrome Web Store][chrome-web-store-versions-src]][chrome-web-store-url]
[![][chrome-web-store-users-src]][chrome-web-store-url]
[![][chrome-web-store-stars-src]][chrome-web-store-url]  
also compatible with
[![Google Chrome][browser-chrome-src]][chrome-web-store-url]
[![Microsoft Edge][browser-edge-src]][chrome-web-store-url]
[![Brave][browser-brave-src]][chrome-web-store-url]

## Available Plugins

☑️ Enabled by default.
🪄 Works automatically when enabled.
👆 Requires a user action (like a click) to work.

|                           | Name                                                                    | Description                                                      |      |
|:--------------------------|:------------------------------------------------------------------------|:-----------------------------------------------------------------|:----:|
| ![General][general-src]   | [absoluteDate](plugins/absoluteDate.ts)                                 | Converts relative dates (e.g., "2 hours ago") to absolute dates. | ☑️🪄 |
| ![General][general-src]   | [copyIssueKeyAndSubjects](plugins/copyIssueKeyAndSubjects.ts)           | Copies the key and subject of issues.                            | ☑️👆 |
| ![General][general-src]   | [favicon](plugins/favicon.ts)                                           | Changes the favicon based on the project.                        | ☑️🪄 |
| ![General][general-src]   | [jumpIssue](plugins/jumpIssue.ts)                                       | Allows jumping directly to an issue by its key.                  | ☑️👆 |
| ![General][general-src]   | [openInDialog](plugins/openInDialog/index.ts)                           | Opens links in a dialog box instead of a new tab.                | ☑️👆 |
| ![General][general-src]   | [quickSearch](plugins/quickSearch.ts)                                   | Provides a quick search functionality.                           | ☑️🪄 |
| ![General][general-src]   | [searchKeyboard](plugins/searchKeyboard.ts)                             | Adds keyboard shortcuts for searching.                           | ☑️🪄 |
| ![General][general-src]   | [sidebarAutoClose](plugins/sidebarAutoClose.ts)                         | Automatically closes the sidebar.                                | ☑️🪄 |
| ![General][general-src]   | [userSwitcher](plugins/userSwitcher/index.ts)                           | Allows for quick user switching.                                 | ☑️👆 |
| ![Issue][issue-src]       | [autoResolution](plugins/autoResolution.ts)                             | Automatically sets the resolution for an issue when closed.      | ☑️🪄 |
| ![Issue][issue-src]       | [expandDiffFileLink](plugins/expandDiffFileLink/index.ts)               | Expands long file paths in pull request diffs.                   | ☑️🪄 |
| ![Issue][issue-src]       | [extendDesc](plugins/extendDesc.ts)                                     | Expands the description field on the issue details page.         | ☑️🪄 |
| ![Issue][issue-src]       | [hideEmptyColumn](plugins/hideEmptyColumn/index.ts)                     | Hides empty columns in the issue list view.                      | ☑️🪄 |
| ![Issue][issue-src]       | [projectIssueFilter](plugins/projectIssueFilter/index.ts)               | Adds a filter to the cross-project issue list.                   | ☑️👆 |
| ![Issue][issue-src]       | [totalTime](plugins/totalTime/index.ts)                                 | Calculates and displays the total estimated and actual time.     | ☑️🪄 |
| ![Board][board-src]       | [boardOneline](plugins/boardOneline/index.ts)                           | Displays issue titles on a single line in the Kanban board.      | ☑️👆 |
| ![Gantt][gantt-src]       | [ganttFilterParentAndChild](plugins/ganttFilterParentAndChild/index.ts) | Filters parent and child issues in the Gantt chart.              | ☑️👆 |
| ![Wiki][wiki-src]         | [childPage](plugins/childPage.ts)                                       | Displays a list of child pages on a Wiki page.                   | ☑️🪄 |
| ![Wiki][wiki-src]         | [copyWiki](plugins/copyWiki.ts)                                         | Adds a button to copy a Wiki page.                               | ☑️👆 |
| ![Wiki][wiki-src]         | [hr](plugins/hr/index.ts)                                               | Adds a horizontal rule (`<hr>`) button to the editor toolbar.    | ☑️🪄 |
| ![Wiki][wiki-src]         | [oldPost](plugins/oldPost/index.ts)                                     | Displays a warning on old Wiki posts.                            | ☑️🪄 |
| ![Wiki][wiki-src]         | [plantuml](plugins/plantuml.ts)                                         | Renders PlantUML diagrams in Wiki pages.                         | ☑️🪄 |
| ![Document][document-src] | [hideDocumentToolbar](plugins/hideDocumentToolbar/index.ts)             | Hides the toolbar in the document view.                          | ☑️🪄 |
| ![Document][document-src] | [zenMode](plugins/zenMode/index.ts)                                     | Provides a distraction-free "Zen Mode" for viewing and editing.  | ☑️👆 |
| ![Git][git-src]           | [copyPullSummary](plugins/copyPullSummary/index.ts)                     | Copies the summary (title and URL) of a pull request.            | ☑️👆 |
| ![Git][git-src]           | [copyRawFile](plugins/copyRawFile.ts)                                   | Adds a button to copy the raw content of a file.                 | ☑️👆 |
| ![Git][git-src]           | [filePermalink](plugins/filePermalink.ts)                               | Gets a permalink for a file in the repository.                   | ☑️👆 |
| ![Git][git-src]           | [gitSmallContainer](plugins/gitSmallContainer/index.ts)                 | Reduces the size of the Git repository container.                | ☑️🪄 |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for this.

## License

[MIT](LICENSE) License (c) 2018 Nulab Inc.

<!-- sources and urls -->

[chrome-web-store-url]: https://chromewebstore.google.com/detail/backlog-power-ups/oknjgkbkglfeeobjojelkbhfpjkgcndb

[chrome-web-store-versions-src]: https://img.shields.io/chrome-web-store/v/oknjgkbkglfeeobjojelkbhfpjkgcndb?style=for-the-badge

[chrome-web-store-users-src]: https://img.shields.io/chrome-web-store/users/oknjgkbkglfeeobjojelkbhfpjkgcndb?style=for-the-badge

[chrome-web-store-stars-src]: https://img.shields.io/chrome-web-store/stars/oknjgkbkglfeeobjojelkbhfpjkgcndb?style=for-the-badge

[browser-chrome-src]: https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/chrome/chrome_16x16.png

[browser-edge-src]: https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/edge/edge_16x16.png

[browser-brave-src]: https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/brave/brave_16x16.png

[general-src]: https://img.shields.io/badge/General-007BFF?style=flat-square

[issue-src]: https://img.shields.io/badge/Issue-28A745?style=flat-square

[board-src]: https://img.shields.io/badge/Board-17A2B8?style=flat-square

[gantt-src]: https://img.shields.io/badge/Gantt-9013FE?style=flat-square

[wiki-src]: https://img.shields.io/badge/Wiki-E85D04?style=flat-square

[document-src]: https://img.shields.io/badge/Document-4A4A4A?style=flat-square

[git-src]: https://img.shields.io/badge/Git-D94125?style=flat-square
