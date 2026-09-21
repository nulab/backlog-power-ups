# <img src="assets/icon.png" width="45"> Backlog Power Ups

> Browser extension - Power up your [Backlog](https://backlog.com) with useful plugins.

## Install

> [![Chrome Web Store][chrome-web-store-versions-src]][chrome-web-store-url] [![][chrome-web-store-users-src]][chrome-web-store-url] [![][chrome-web-store-stars-src]][chrome-web-store-url]  
> also compatible with
> [<img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/chrome/chrome.svg" width="20" alt="Google Chrome">][chrome-web-store-url] [<img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/edge/edge.svg" width="20" alt="Microsoft Edge">][chrome-web-store-url] [<img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/75.0.1/brave/brave.svg" width="20" alt="Brave">][chrome-web-store-url]

## Available Plugins

☑️ Enabled by default.  
🪄 Works automatically when enabled.  
👆 Requires a user action (like a click) to work.

|                               Group                               | Description                                                                                                                                                              |     |     |
| :---------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :-: |
|        [![General][general-src]](plugins/absoluteDate.ts)         | Displays update times in a specific format like _12:00_ instead of relative time like _2 minutes ago_.                                                                   |     | 🪄  |
|   [![General][general-src]](plugins/copyIssueKeyAndSubjects.ts)   | Adds a button to copy the displayed issues on the dashboard's _My Issues_ and issue search results.                                                                      | ☑️  | 👆  |
|           [![General][general-src]](plugins/favicon.ts)           | Replaces the default Backlog favicon with the project or space icon.                                                                                                     |     | 🪄  |
|          [![General][general-src]](plugins/jumpIssue.ts)          | Displays a prompt to jump to an issue key using `Cmd/Ctrl + K`.                                                                                                          | ☑️  | 👆  |
|     [![General][general-src]](plugins/openInDialog/index.ts)      | Long-press a link within a space to open its destination in a dialog box.                                                                                                | ☑️  | 👆  |
|         [![General][general-src]](plugins/quickSearch.ts)         | Focuses the search bar in the global navigation with `Cmd/Ctrl + Shift + K`.<br>If text is selected, it will be used as the search keyword.                              | ☑️  | 🪄  |
|       [![General][general-src]](plugins/searchKeyboard.ts)        | Enables keyboard navigation for search results in the global bar.<br>Tab: Switch search target, Up/Down: Select suggestion, Left/Right: Paginate, Enter: Open selection. |     | 🪄  |
|      [![General][general-src]](plugins/sidebarAutoClose.ts)       | Automatically opens and closes the sidebar based on the screen size.                                                                                                     | ☑️  | 🪄  |
|     [![General][general-src]](plugins/userSwitcher/index.ts)      | Adds a search bar to the user page to find and switch between users.                                                                                                     | ☑️  | 👆  |
|     [![Board][board-src]](plugins/boardBulkStatus/index.ts)      | Select multiple cards on the board with `Cmd/Ctrl + click` or `Shift + click`, then change all their statuses at once.                                                   | ☑️  | 👆  |
|         [![Issue][issue-src]](plugins/autoResolution.ts)          | Automatically sets the _Resolution_ to _Fixed_ when an issue's _Status_ is changed to _Closed_.                                                                          |     | 🪄  |
|           [![Issue][issue-src]](plugins/extendDesc.ts)            | Increases the default size of the description input field.                                                                                                               |     | 🪄  |
|      [![Issue][issue-src]](plugins/hideEmptyColumn/index.ts)      | Hides columns that have no values in the issue list.                                                                                                                     |     | 🪄  |
|    [![Issue][issue-src]](plugins/projectIssueFilter/index.ts)     | Adds a dropdown menu to the top right of the issue list to switch project filters.                                                                                       | ☑️  | 👆  |
|         [![Issue][issue-src]](plugins/totalTime/index.ts)         | Displays the total of _Estimated Hours_ and _Actual Hours_ for the listed issues at the bottom left of the issue list.                                                   | ☑️  | 🪄  |
| [![Gantt][gantt-src]](plugins/ganttFilterParentAndChild/index.ts) | Adds a dropdown menu to the Gantt chart to filter by parent-child relationships.                                                                                         | ☑️  | 👆  |
|             [![Wiki][wiki-src]](plugins/childPage.ts)             | Sets the default location for new Wiki pages to be under the currently viewed page.                                                                                      |     | 🪄  |
|             [![Wiki][wiki-src]](plugins/copyWiki.ts)              | Copies a Wiki page to another project.                                                                                                                                   | ☑️  | 👆  |
|             [![Wiki][wiki-src]](plugins/hr/index.ts)              | Renders `---` and `___` as horizontal rules in Backlog-style Wikis.                                                                                                      |     | 🪄  |
|           [![Wiki][wiki-src]](plugins/oldPost/index.ts)           | Displays a message on pages that haven't been updated in over a year.                                                                                                    | ☑️  | 🪄  |
|             [![Wiki][wiki-src]](plugins/plantuml.ts)              | Renders PlantUML diagrams in Backlog-style Wikis.<br>(Uses the plantuml.com API).                                                                                        |     | 🪄  |
| [![Document][document-src]](plugins/hideDocumentToolbar/index.ts) | Hides the toolbar on the editing screen.                                                                                                                                 |     | 🪄  |
|       [![Document][document-src]](plugins/zenMode/index.ts)       | Adds a flame button to the top right of the page to hide the Backlog UI.                                                                                                 | ☑️  | 👆  |
|        [![Git][git-src]](plugins/copyPullSummary/index.ts)        | Adds a button to copy the pull request number and title.                                                                                                                 | ☑️  | 👆  |
|             [![Git][git-src]](plugins/copyRawFile.ts)             | Adds a button to copy the raw content of a file.                                                                                                                         | ☑️  | 👆  |
|            [![Git][git-src]](plugins/filePermalink.ts)            | Adds a link to navigate to the file URL with the commit hash when viewing a file on a branch.                                                                            | ☑️  | 👆  |
|      [![Git][git-src]](plugins/expandDiffFileLink/index.ts)       | Makes the entire file entry in a diff list clickable, not just the filename.                                                                                             |     | 🪄  |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for this.

## License

[MIT](LICENSE) License (c) 2018 Nulab Inc.

<!-- sources and urls -->

[chrome-web-store-url]: https://chromewebstore.google.com/detail/backlog-power-ups/oknjgkbkglfeeobjojelkbhfpjkgcndb
[chrome-web-store-versions-src]: https://img.shields.io/chrome-web-store/v/oknjgkbkglfeeobjojelkbhfpjkgcndb?style=for-the-badge
[chrome-web-store-users-src]: https://img.shields.io/chrome-web-store/users/oknjgkbkglfeeobjojelkbhfpjkgcndb?style=for-the-badge
[chrome-web-store-stars-src]: https://img.shields.io/chrome-web-store/stars/oknjgkbkglfeeobjojelkbhfpjkgcndb?style=for-the-badge
[general-src]: https://img.shields.io/badge/General-007BFF?style=flat-square
[issue-src]: https://img.shields.io/badge/Issue-28A745?style=flat-square
[board-src]: https://img.shields.io/badge/Board-00A3AF?style=flat-square
[gantt-src]: https://img.shields.io/badge/Gantt-9013FE?style=flat-square
[wiki-src]: https://img.shields.io/badge/Wiki-E85D04?style=flat-square
[document-src]: https://img.shields.io/badge/Document-4A4A4A?style=flat-square
[git-src]: https://img.shields.io/badge/Git-D94125?style=flat-square
