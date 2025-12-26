# Laravel React Starter Kit

This is a starter kit for a Laravel application with a React frontend using Inertia.js.

## Development Setup

To get started with the project for local development, follow these steps.

### Prerequisites

-   PHP 8.4 or higher
-   Composer
-   Node.js and npm

### Installation

1.  **Run the setup script:**
    This command will install all PHP and JavaScript dependencies, create your `.env` file, generate an application key, link storage, and run database migrations.

    ```bash
    composer setup
    ```

2.  **Start the development servers:**
    This command will concurrently start the PHP development server, the Vite server for frontend assets, and the queue and schedule workers.

    ```bash
    composer dev
    ```

Your application will be running at `http://127.0.0.1:8000`.
