# User Management Application

This application is a React-based user management tool that allows users to view, edit, and delete user information. It utilizes a mock API, **ReqRes**, for data fetching and manipulation.

## Features

* **User Listing:** Displays a list of users with their avatars, first names, and last names.
* **User Editing:** Allows users to edit user details such as first name, last name, and email.
* **User Deletion:** Enables users to delete user records.
* **Pagination:** Implements pagination for efficient handling of large datasets.
* **Search Functionality:** Provides a search bar to filter users by name.
* **Local Storage Management:** Utilizes local storage for caching and managing user data.
* **Token Based Authentication:** Ensures that only logged in users can access the application.
* **Loading State:** Displays a loading message during data fetching.
* **Error Handling:** Displays error messages for API failures.
* **Success Messages:** Displays success messages for successful operations.

## Tech Stack

* **React:** For building the user interface.
* **React Router DOM:** For client-side routing.
* **Axios:** For making HTTP requests to the **ReqRes** mock API.
* **Local Storage:** For caching and managing user data.

## Installation and Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/rajeev2004/User-Management-Application.git
    cd User-Management-Application

2.  **Install dependencies:**

    ```bash
    npm install
    
3.  **Start the development server:**

    ```bash
    npm run dev

4.  **Open the application in your browser:**

    Go to `http://localhost:5173` in your web browser.

## Assumptions and Considerations

* **ReqRes API Availability:** The application relies on the **ReqRes** mock API, which needs to be accessible via the internet.
* **Local Storage Usage:** The application uses local storage to cache user data and deleted user IDs. This has implications for data persistence and privacy.
* **Token Authentication:** The application relies on a token-based authentication system. If the token is invalid or expired, the user will be redirected to the login page.
* **Error Handling:** The application includes basic error handling.
* **UI/UX:** Basic styling is implemented.
* **Page Limit:** The application currently fetches the first two pages of data. If the dataset is larger, additional logic will be required.
* **Search Functionality:** The search function searches based on the concatenated first and last names. If more robust searching is needed, backend searching should be used.
* **Deleted User Persistence:** The application stores deleted user ID's into the local storage. If this is not cleared then the deleted users will not show up after re-login the page.
* **Updated User Persistence:** The application stores updated user data into the local storage. If this is not cleared then the updated users will show up after re-login the page.
* **Mock API Limitations:** Because **ReqRes** is a mock API, it may not perfectly represent a real-world API. Features like actual data persistence or complex server-side logic are not available.

## API Endpoints (ReqRes)

* `GET https://reqres.in/api/users?page={page}`: Retrieves a list of users.
* `GET https://reqres.in/api/users/{id}`: Retrieves details of a specific user.
* `PUT https://reqres.in/api/users/{id}`: Updates user details.
* `DELETE https://reqres.in/api/users/{id}`: Deletes a user.

## Demo

You can check out the live website [here](https://rajeev2004.github.io/User-Management-Application/)

![ClickStayDine Screenshot](https://github.com/rajeev2004/User-Management-Application/blob/main/src/assets/user-Management-ss.png?raw=true)
