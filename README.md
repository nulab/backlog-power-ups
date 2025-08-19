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

|                           | Name                                                                    | Description                                                                                                                                                              |       |
|:-------------------------:|:------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----:|
|  ![General][general-src]  | [absoluteDate](plugins/absoluteDate.ts)                                 | Displays update times in a specific format like '12:00' instead of relative time like '2 minutes ago'.                                                                   |  🪄   |
|  ![General][general-src]  | [copyIssueKeyAndSubjects](plugins/copyIssueKeyAndSubjects.ts)           | Adds a button to copy the displayed issues on the dashboard's "My Issues" and issue search results.                                                                      | ☑️👆  |
|  ![General][general-src]  | [favicon](plugins/favicon.ts)                                           | Replaces the default Backlog favicon with the project or space icon.                                                                                                     |  🪄   |
|  ![General][general-src]  | [jumpIssue](plugins/jumpIssue.ts)                                       | Displays a prompt to jump to an issue key using `Cmd/Ctrl + K`.                                                                                                          | ☑️👆  |
|  ![General][general-src]  | [openInDialog](plugins/openInDialog/index.ts)                           | Long-press a link within a space to open its destination in a dialog box.                                                                                                | ☑️👆  |
|  ![General][general-src]  | [quickSearch](plugins/quickSearch.ts)                                   | Focuses the search bar in the global navigation with `Cmd/Ctrl + Shift + K`.<br>If text is selected, it will be used as the search keyword.                              | ☑️🪄  |
|  ![General][general-src]  | [searchKeyboard](plugins/searchKeyboard.ts)                             | Enables keyboard navigation for search results in the global bar.<br>Tab: Switch search target, Up/Down: Select suggestion, Left/Right: Paginate, Enter: Open selection. |  🪄   |
|  ![General][general-src]  | [sidebarAutoClose](plugins/sidebarAutoClose.ts)                         | Automatically opens and closes the sidebar based on the screen size.                                                                                                     | ☑️🪄  |
|  ![General][general-src]  | [userSwitcher](plugins/userSwitcher/index.ts)                           | Adds a search bar to the user page to find and switch between users.                                                                                                     | ☑️👆  |
|    ![Issue][issue-src]    | [autoResolution](plugins/autoResolution.ts)                             | Automatically sets the "Resolution" to "Fixed" when an issue's "Status" is changed to "Closed".                                                                          |  🪄   |
|    ![Issue][issue-src]    | [extendDesc](plugins/extendDesc.ts)                                     | Increases the default size of the description input field.                                                                                                               |  🪄   |
|    ![Issue][issue-src]    | [hideEmptyColumn](plugins/hideEmptyColumn/index.ts)                     | Hides columns that have no values in the issue list.                                                                                                                     |  🪄   |
|    ![Issue][issue-src]    | [projectIssueFilter](plugins/projectIssueFilter/index.ts)               | Adds a dropdown menu to the top right of the issue list to switch project filters.                                                                                       | ☑️👆  |
|    ![Issue][issue-src]    | [totalTime](plugins/totalTime/index.ts)                                 | Displays the total of "Estimated Hours" and "Actual Hours" for the listed issues at the bottom left of the issue list.                                                   | ☑️🪄  |
|    ![Board][board-src]    | [boardOneline](plugins/boardOneline/index.ts)                           | Adds a button to minimize and display board cards on a single line.                                                                                                      | ☑️👆  |
|    ![Gantt][gantt-src]    | [ganttFilterParentAndChild](plugins/ganttFilterParentAndChild/index.ts) | Adds a dropdown menu to the Gantt chart to filter by parent-child relationships.                                                                                         | ☑️👆  |
|     ![Wiki][wiki-src]     | [childPage](plugins/childPage.ts)                                       | Sets the default location for new Wiki pages to be under the currently viewed page.                                                                                      |  🪄   |
|     ![Wiki][wiki-src]     | [copyWiki](plugins/copyWiki.ts)                                         | Copies a Wiki page to another project.                                                                                                                                   | ☑️👆  |
|     ![Wiki][wiki-src]     | [hr](plugins/hr/index.ts)                                               | Renders `---` and `___` as horizontal rules in Backlog-style Wikis.                                                                                                      |  🪄   |
|     ![Wiki][wiki-src]     | [oldPost](plugins/oldPost/index.ts)                                     | Displays a message on pages that haven't been updated in over a year.                                                                                                    | ☑️🪄  |
|     ![Wiki][wiki-src]     | [plantuml](plugins/plantuml.ts)                                         | Renders PlantUML diagrams in Backlog-style Wikis.<br>(Uses the plantuml.com API).                                                                                        |  🪄   |
| ![Document][document-src] | [hideDocumentToolbar](plugins/hideDocumentToolbar/index.ts)             | Hides the toolbar on the editing screen.                                                                                                                                 |  🪄   |
| ![Document][document-src] | [zenMode](plugins/zenMode/index.ts)                                     | Adds a flame button to the top right of the page to hide the Backlog UI.                                                                                                 | ☑️👆  |
|      ![Git][git-src]      | [copyPullSummary](plugins/copyPullSummary/index.ts)                     | Adds a button to copy the pull request number and title.                                                                                                                 | ☑️👆  |
|      ![Git][git-src]      | [copyRawFile](plugins/copyRawFile.ts)                                   | Adds a button to copy the raw content of a file.                                                                                                                         | ☑️👆  |
|      ![Git][git-src]      | [filePermalink](plugins/filePermalink.ts)                               | Adds a link to navigate to the file URL with the commit hash when viewing a file on a branch.                                                                            | ☑️👆  |
|      ![Git][git-src]      | [gitSmallContainer](plugins/gitSmallContainer/index.ts)                 | Sets a maximum width for the content on Git pages where no files are displayed.                                                                                          |  🪄   |
|      ![Git][git-src]      | [expandDiffFileLink](plugins/expandDiffFileLink/index.ts)               | Makes the entire file entry in a diff list clickable, not just the filename.                                                                                             |  🪄   |

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
