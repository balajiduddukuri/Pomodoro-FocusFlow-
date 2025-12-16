# FocusFlow 🍅

A premium, customizable Pomodoro timer application designed for deep work sessions. FocusFlow combines a distraction-free timer with task management, real-time weather updates, usage statistics, and beautiful theming.

## 🌟 Features

*   **Flexible Timer Modes**:
    *   **Pomodoro**: Standard focus intervals (default 25m).
    *   **Short Break**: Quick rests (default 5m).
    *   **Long Break**: Extended breaks after a set number of intervals.
    *   **Custom Timer**: User-defined duration with quick presets (10m - 60m).
*   **Task Management**:
    *   Add, edit, and delete tasks.
    *   Estimate Pomodoros required per task.
    *   Track active tasks and completion status.
*   **Visual Themes**:
    *   ☀️ **Light**: Clean and airy.
    *   🌙 **Dark**: Easy on the eyes for low light.
    *   ⚡ **Neon**: High-contrast, vibrant aesthetic (OLED friendly).
*   **Dashboard Widget**:
    *   Real-time clock.
    *   Local weather updates (via Open-Meteo API).
    *   Daily motivational quotes.
*   **Statistics**:
    *   Track daily focus time.
    *   Visual bar charts for the last 7 days of activity.
*   **Customization**:
    *   Adjust timer durations.
    *   Toggle sound effects (oscillator-based, no external assets).
    *   Auto-start options for breaks and pomodoros.
    *   **Layout Options**: Switch between "Stacked" (Center) or "Side-by-Side" (Split) views.
*   **Persistence**: All settings, tasks, and stats are saved automatically to `localStorage`.

## 🛠️ Tech Stack

*   **Framework**: React 19
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Charts**: Recharts
*   **APIs**: Open-Meteo (Weather), HTML5 Geolocation, Web Audio API.

## 📂 Project Structure

```text
├── index.html                  # Entry HTML with Tailwind script and CSS variables
├── index.tsx                   # React entry point
├── App.tsx                     # Main application logic and layout controller
├── types.ts                    # TypeScript interfaces and default constants
├── metadata.json               # Application metadata and permissions
│
├── components/
│   ├── CircularTimer.tsx       # SVG-based animated countdown timer
│   ├── TaskList.tsx            # Task CRUD and management UI
│   ├── SettingsModal.tsx       # Configuration for timers, themes, and layout
│   ├── StatsModal.tsx          # Statistical reports and charts
│   └── DashboardWidget.tsx     # Weather, Time, and Quotes display
│
└── utils/
    └── sound.ts                # Audio generation using Web Audio API (Oscillators)
```

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm start
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## ⚙️ Configuration details

### Theming
Colors are defined as CSS variables in `index.html` and mapped in `tailwind.config`.
*   To change the "Neon" theme colors, modify the `.neon` class variables in the `<style>` block of `index.html`.

### Audio
The app uses the Web Audio API to generate sounds on the fly to avoid handling static asset paths.
*   See `utils/sound.ts` to adjust frequencies or wave types for notifications.

### Weather
Weather functionality requires the user to grant **Geolocation** permissions.
*   If denied, the widget displays a generic state or hides the weather portion gracefully.
