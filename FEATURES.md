# Project Features

This document outlines the main features of the application, as implemented in the Laravel backend.

## General & E-commerce Features

-   **Shopping Experience (`ShopController`, `ProductController`):**
    -   A public-facing shop page where users can browse products.
    -   Products can be filtered by category.
    -   A dedicated page to view the details of a single product is available to all authenticated users.

-   **Shopping Cart (`CartController`):**
    -   Users can add products to their shopping cart.
    -   Quantities of items in the cart can be updated.
    -   Items can be removed from the cart.

-   **Order Management (`OrderController`):**
    -   Users can place an order from the items in their cart. The system validates stock availability before confirming the order.
    -   Users can view their own order history.
    -   A user can view the details of a specific order they placed.

## Admin-only Features

-   **Dashboard (`DashboardController`):**
    -   A comprehensive dashboard for administrators displaying key metrics:
        -   Total revenue
        -   Total number of sales
        -   Total number of customers
        -   Total number of products
    -   Displays a list of recent orders.
    -   Includes a "Low Stock Products" panel to quickly see items that need restocking.
    -   Non-admin users are automatically redirected to the shop page.

-   **Product Management (`ProductController`):**
    -   Full CRUD (Create, Read, Update, Delete) functionality for products, restricted to admins.
    -   Includes handling of product image uploads.

-   **Category Management (`CategoryController`):**
    -   Full CRUD functionality for product categories, restricted to admins.

-   **User Management (`UserController`):**
    -   Admins can view a paginated list of all users in the system.
    -   Admins can view a specific user's profile and their complete order history.

-   **Order Status Management (`OrderController`):**
    -   Admins have the ability to update the status of any order (e.g., from 'pending' to 'processing', 'completed', or 'cancelled').

## User Account & Security

-   **Authentication:**
    -   Standard user registration, login, and password reset functionality provided by Laravel Fortify.
-   **User Settings (`Settings/` controllers):**
    -   Users can update their profile information (name, email).
    -   Users can change their password.
    -   Two-Factor Authentication (2FA) can be enabled, configured, and disabled for enhanced security.
-   **Role-Based Access Control (RBAC):**
    -   The application distinguishes between 'admin' and 'customer' (user) roles.
    -   Admin-only sections and functionalities are protected using middleware.
    -   The user interface (e.g., navigation sidebar) is dynamically adjusted based on the user's role.

## Backend & Automation

-   **Asynchronous Notifications (`CheckLowStockListener`):**
    -   When an order is placed, an `OrderCreated` event is dispatched.
    -   A queued listener checks if the ordered products' stock has fallen below a certain threshold (e.g., 5 items).
    -   If stock is low, an email notification is automatically sent to all administrators. This is handled in the background to not affect the user's checkout experience.

-   **Scheduled Tasks (`SendDailySalesReport` command):**
    -   An Artisan command `sales:send-daily-report` is available to generate and send a summary of the day's sales to all admins.
    -   This command is scheduled to run automatically every day at 8:00 PM.
    -   A manual trigger for this command is available on the admin dashboard.

-   **Logging & Debugging:**
    -   **Email Logging (`EmailLogController`):** All important outgoing emails (like low stock alerts and daily reports) are logged in the database. Users can view a history of emails sent to them.
    -   **Laravel Telescope (`TelescopeServiceProvider`):** Integrated for deep application debugging. Access is restricted to admins in production environments.
