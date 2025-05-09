# Finanseer - Financial Analytics Dashboard

Finanseer is a comprehensive financial analytics dashboard built using the MERN stack (MongoDB, Express, React with TypeScript, Node.js). The application helps businesses monitor key performance indicators (KPIs), manage financial data, visualize trends, and predict future financial performance.

## Features

- **Dashboard**: Real-time KPIs and financial metrics
- **Product Management**: Inventory tracking and product analytics
- **Transaction Management**: Filter and view financial transactions
- **Predictions**: Forecast future financial performance
- **User Authentication**: Secure JWT-based authentication with role management
- **Data Visualization**: Interactive charts for financial analysis

## Tech Stack

### Frontend
- React with TypeScript
- Material UI (MUI) for responsive UI components
- Recharts for data visualization
- Redux Toolkit (RTK) + RTK Query for state management
- React Router for client-side routing

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT authentication
- RESTful API

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/sujeethshingade/finanseer.git
cd finanseer
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

4. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/finanseer
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

5. Start the development servers

Server:
```bash
cd server
npm run dev
```

Client:
```bash
cd client
npm start
```

## API Endpoints

### Authentication
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login and get token
- `GET /api/user/profile` - Get user profile

### KPIs
- `GET /api/kpi` - Get all KPIs
- `POST /api/kpi` - Create KPI entry
- `GET /api/kpi/dashboard` - Get dashboard metrics

### Products
- `GET /api/product` - Get all products
- `GET /api/product/:id` - Get product by ID
- `POST /api/product` - Create product
- `PATCH /api/product/:id` - Update product
- `DELETE /api/product/:id` - Delete product
- `GET /api/product/analytics` - Get product analytics

### Transactions
- `GET /api/transaction` - Get all transactions
- `GET /api/transaction/:id` - Get transaction by ID
- `POST /api/transaction` - Create transaction
- `PATCH /api/transaction/:id` - Update transaction
- `DELETE /api/transaction/:id` - Delete transaction

## License

MIT
