# Code Nexus

Code Nexus is an advanced code editor application designed to facilitate real-time code editing, collaboration, and project management. Built with a modern tech stack, it offers robust features for code editing, real-time syntax highlighting, and secure user authentication.

## Features

- **Advanced Code Editing**: Utilize a sophisticated code editor with real-time syntax highlighting.
- **Secure Authentication**: Robust user authentication and authorization.
- **Responsive UI**: User-friendly interface for CRUD operations and real-time code execution.
- **Real-Time Collaboration**: Collaborate on code in real-time with session control.
- **Error Handling**: Comprehensive error handling for reliable performance.

## Technologies Used

- **Frontend**: React, Redux, Monaco Editor, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **Real-Time Communication**: Socket.IO
- **API Management**: Axios
- **Code Execution**: Child Process

## Setup and Installation

### Frontend Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/code-nexus.git
    ```

2. **Navigate to the frontend directory**:
    ```bash
    cd code-nexus/frontend
    ```

3. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Run the development server**:
    ```bash
    npm run dev
    ```

### Backend Setup

1. **Navigate to the backend directory**:
    ```bash
    cd code-nexus/backend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Configure environment variables**: Create a `.env` file and add the necessary environment variables. Example:
    ```
    MONGO_URI=mongodb://localhost:27017/code-nexus
    JWT_SECRET=your_jwt_secret
    ```

4. **Run the server**:
    ```bash
    npm start
    ```

## Preview

Here's a preview of Code Nexus:

1. **Login Screen**  
   ![Login Screen](https://github.com/KumudBhatt/Code-Nexus/blob/main/main/frontend/preview/1.png)

2. **Dashboard**  
   ![Dashboard](https://github.com/KumudBhatt/Code-Nexus/blob/main/main/frontend/preview/2.png)

3. **Projects View**  
   ![Projects View](https://github.com/KumudBhatt/Code-Nexus/blob/main/main/frontend/preview/3.png)

4. **Collaborative Code Editor**  
   ![Collaborative Code Editor](https://github.com/KumudBhatt/Code-Nexus/blob/main/main/frontend/preview/4.png)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## Contact

For any questions or support, please reach out to [kumud.bhatt444@gmail.com](mailto:kumud.bhatt444@gmail.com).
