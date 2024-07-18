# Express Product API with JWT Authentication

This project implements a RESTful API with JWT authentication for managing products using Node.js, Express.js, and PostgreSQL with Sequelize ORM.

**Deployed Application:** The deployed application can be accessed at [Express Product API](https://yuldoshev.uz/express-product-api).

## Getting Started

To get started with this project, follow these steps:

### Prerequisites

- Node.js and npm installed on your machine
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yuldoshevuz/express-product-api.git
   cd express-product-api
   ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables:
Create a `.env` file and add the following variables:
    ```bash
    PORT=5002
    JWT_SECRET=SomeJwtSecretKey
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=your_db_password
    DB_NAME=express_product_api
    ```

## Usage

1. Start the server
    ```bash
    npm start
    ```
2. Use API endpoints with tools like Postman or curl:

    - `POST /auth/register` - Register a new user (requires `fullName`, `email`, `password`).
    - `POST /auth/login` - Login with existing user credentials (requires `email`, `password`).
    - `GET /products` - Fetch all products.
    - `POST /products` - Create a new product (requires `name`, `description`, `price`).
    - `PUT /products/:id` - Update an existing product (requires at least one of `name`, `description`, `price`).
    - `DELETE /products/:id` - Delete a product by ID.

## Documentation
Swagger is integrated for API documentation. You can access it at:
    - `/docs` - Swagger UI for exploring and testing API endpoints.

## Testing
To run unit tests using Mocha and Chai:
```bash
npm test
```
Before running tests, ensure you have a test user registered in the database. You can create one using the following credentials:

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
