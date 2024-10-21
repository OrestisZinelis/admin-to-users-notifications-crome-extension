# Admin to Users Notifications Chrome Extension

This Chrome extension is designed to display organization-wide messages from an admin to users. It showcases frontend development skills, understanding of browser extension architecture, and implementation of real-world features using Vue 3 and Vite.

## Features

- Displays messages from an organization's admin to users.
- Shows a badge icon when there are unread messages.
- Allows users to mark messages as read and delete them.
- Stores message history locally using Chrome's storage API.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur for Vue 3 projects).

## Project Setup

Install dependencies:

`npm install`

Type-check, compile, and minify for production:

`npm run build`

Lint with [ESLint](https://eslint.org/):

`npm run lint`

## Extension Usage

1. Load the extension into Chrome using the Extensions page (`chrome://extensions/`).
2. Enable Developer mode and use the "Load unpacked" option to select the `dist` folder after build.
3. Click on the extension icon in the toolbar to view messages.

## Simulating Admin Actions and User Interactions

Admin actions and user interactions can be simulated for testing purposes by sending messages to the background script from the console.

### Simulating Admin Actions

Admin actions such as sending new messages can be simulated using the following commands:

Send a set of dummy messages as if sent by an admin `chrome.runtime.sendMessage({ action: 'simulateAdminSendingMessages' });`

Mark all messages as read `chrome.runtime.sendMessage({ action: 'markAllAsRead' });`

Delete all messages `chrome.runtime.sendMessage({ action: 'deleteAllMessages' });`

### Simulating User Interactions

User interactions such as marking a message as read or deleting a message can be simulated using the following commands:

Replace 'messageId' with the actual ID of the message you want to mark as read `chrome.runtime.sendMessage({ action: 'markAsRead', messageId: 'messageId' });`

Replace 'messageId' with the actual ID of the message you want to delete `chrome.runtime.sendMessage({ action: 'deleteMessage', messageId: 'messageId' });`

### Testing Message Fetching

To test the message fetching functionality, you can trigger the check for new messages using:

`chrome.runtime.sendMessage({ action: 'checkMessages' });`

This will invoke the background script to check for new messages and update the extension badge and popup UI accordingly.

## Architecture Overview

The extension is built using Vue 3 and Vite. The background script checks for new messages periodically, while the popup UI, implemented as a Vue component, allows users to interact with the messages.

### Code Organization

- `background.ts`: Handles fetching messages and managing Chrome storage.
- `Popup.vue`: Manages the popup UI and user interactions.
- `types.ts`: Contains TypeScript type definitions and interfaces for the project.

### State Management

- Popup state is managed using Vue's reactivity system (`ref`).
- Background script uses Chrome storage API for persistent state management.

### Error Handling

- Both popup and background scripts include error handling with try-catch blocks and error logging.

### UI/UX

- Visual indicators for message priority and read status.
- Feedback provided for loading, errors, and empty states.
- Utilized UnoCSS for utility-first CSS architecture.

### Performance

- Efficient use of `chrome.storage.local` for data storage.
- Periodic message fetching to minimize unnecessary network requests.

## Contributing

Contributions to improve the extension are welcome. Please follow the standard fork-and-pull request workflow.

## License

[MIT License](LICENSE)

## Acknowledgements

- Vue.js team for the Vue framework.
- Vite team for the Vite build tool.
- Chrome Developers for the Chrome Extension documentation.

## Future Improvements

- Add inline comments for better code understanding.
- Implement notification sounds for high-priority messages.
- Create an options page for user preferences.
- Write more types of tests (integration, E2E).
- Set up CI/CD pipeline for automated testing and deployment.
