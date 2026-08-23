# ChatMe Client — Interactive Chat Interface

The frontend for ChatMe is a responsive React application built with Redux Toolkit, React Router, Socket.io Client, and Tailwind CSS.

---

## 🛠️ Features & Enhancements

### 1. Draggable & Resizable Square Image Cropper
- **Interactive Avatar Editor**: Integrates `InteractiveCropper.jsx` with a sliding crop window that allows the user to choose their profile crop box by dragging and resizing.
- **Strict Blob URL Prevention**: Validates profile picture data states. Submissions are blocked if the URL is a local `blob:` format, ensuring only validated Cloudinary URLs reach the database.

### 2. Auto-Logout on Token Expiration
- **Global Interceptor**: Registered a global response interceptor on Axios. Any backend call yielding `401 Unauthorized` automatically removes local tokens, clears the Redux user state, and redirects to the login screen.
- **Socket Connection Listener**: Intercepts Socket connection errors; if socket authentication is rejected, the client logs out the user immediately.

### 3. Real-Time Chat & Optimistic UI
- **Instant Previews**: Sent messages are added to the list instantly with a `"Sending..."` state and inputs are cleared.
- **Delivery States**: Shows `"Sending..."` tick markers, successfully delivered ticks, or a `"Failed"` label with a clickable `[Retry]` link.
- **Duplication Prevention**: Reconciles optimistic client messages with server records using `clientMessageId` mappings.
- **Listener Cleanups**: Disconnects and cleans up socket event listeners on component unmounts to prevent event duplication leaks.

---

## ⚙️ Setup & Configuration

Create a `.env` file in the `client/` folder:

```env
REACT_APP_BACKEND_URL=http://localhost:8080
```

### Start App

```bash
npm install
npm start
```
