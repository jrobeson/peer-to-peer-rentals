# Peer-to-Peer Rental Platform Backend

A Node.js/TypeScript API that lets users **list**, **search**, **rent**, and **return** items. Data is stored **in-memory** (no external database). Uses a custom `HttpError` class for HTTP-specific error handling and an organized, layered architecture (services, controllers, routes).

> Please note that ONE dummy object has been left in storage or ease of testing.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
  - [1. List an Item](#1-list-an-item)
  - [2. Search Items](#2-search-items)
  - [3. Rent an Item](#3-rent-an-item)
  - [4. Return an Item](#4-return-an-item)
- [Error Handling](#error-handling)
- [Reasoning & Architecture](#reasoning--architecture)

---

## Features

1. **List an Item**: Create a new item with a name, description, price, and default availability.
2. **Search Items**: Retrieve items filtered by `name` and/or `price range`.
3. **Rent an Item**: Mark an item as rented for a given date range (`availability = false`).
4. **Return an Item**: Mark an item as returned (`availability = true`).
5. **Custom HTTP Error Handling**: Uses a `HttpError` class to provide proper HTTP status codes (like `404`, `400`, `409`, etc.).
6. **In-Memory Data**: No database required—perfect for quick demos or technical interviews.

---

## Project Structure

```
peer-to-peer-rental/
├── package.json
├── tsconfig.json
└── src/
    └── index.ts # Main entry point, sets up Express
    └── dataStore.ts # In-memory data
    ├── utils/
         └── HttpError.ts # Custom error class with statusCode
         └── dateutils.ts # Custom date formatter and date comparison
    ├── services/
         └── items.service.ts # Business logic (add, rent, return, etc.)
    ├── types/
         └── index.ts # All of our types
    ├── controllers/
         └── items.controller.ts # Express handlers calling the service
    ├── routes/
         └── items.routes.ts # Defines the REST endpoints
```

### Key Folders/Files

- **`dataStore.ts`**: Contains the `items` array
- **`types/index.ts`**: Contains all tpyes
- **`items.service.ts`**: “Service layer” with core logic (search, rent, return). Throws custom HTTP errors.
- **`items.controller.ts`**: “Controller layer” that handles requests/responses, passing errors to a global handler.
- **`items.routes.ts`**: Binds URIs (`/items`, `/items/:id/rent`, etc.) to controller functions.
- **`HttpError.ts`**: A small class that extends `Error` with a `statusCode` property, so HTTP statues can be easily returned.

---

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **In-Memory Storage**: Simple array (`items`) – no database dependency
- **Error Handling**: Custom `HttpError` class + a global Express error handler
- **UUID Generation**: [uuid](https://www.npmjs.com/package/uuid) for unique rental period IDs

---

## Setup & Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/jrobeson/peer-to-peer-rentals.git
   cd peer-to-peer-rental
   ```
2. **Install Dependencies**:
   ```
   npm install
   ```

## Running Locally

1. **Spin up the server**

   ```
   npm run dev
   ```

2. **Server started** on http://localhost:3000. Check console for this
   ```
   Listening on http://localhost:3000
   ```

## API Endpoints

Base URL: `http://localhost:3000/api`

### 1. List an Item

- **Endpoint**: `POST /api/items`
- **Body** (JSON):

```json
{
	"id": "abc123",
	"name": "Cordless Drill",
	"description": "A powerful cordless drill",
	"price": 15
}
```

- **Response (201 Created)**

```json
{
	"message": "Item added successfully!",
	"item": {
		"id": "abc123",
		"name": "Cordless Drill",
		"description": "A powerful cordless drill",
		"price": 15,
		"availability": true,
		"rentalPeriods": []
	}
}
```

### 2. Search Items

- **Endpoint**: `GET /api/items?name=drill&minPrice=10&maxPrice=20`
- **Query Params**

  - name: parital match on item name
  - minPrice/maxPrice: filter by price range

- **Response (200 OK)**

```json
[
	{
		"message": "Item added successfully!",
		"item": {
			"id": "abc123",
			"name": "Cordless Drill",
			"description": "A powerful cordless drill",
			"price": 15,
			"availability": true,
			"rentalPeriods": []
		}
	}
]
```

### 2. Rent an Item

- **Endpoint**: `POST /api/items/:id/rent`
- **Body (JSON)**:

```json
{
	"startDate": "2025-01-08",
	"endDate": "2025-01-10"
}
```

- **Response (200 OK)**

```json
{
	"message": "Item rented successfully",
	"item": {
		"id": "abc123",
		"name": "Cordless Drill",
		"description": "A powerful cordless drill",
		"price": 15,
		"availability": false,
		"rentalPeriods": [
			{
				"startDate": "2025-01-08",
				"endDate": "2025-01-10",
				"id": "2a4d0548-c292-4d55-9754-e31bf3ec5506",
				"status": "rented"
			}
		]
	},
	"id": "2a4d0548-c292-4d55-9754-e31bf3ec5506"
}
```

### 2. Return an Item

- **Endpoint**: `POST /api/items/:id/return/:rentalId`
- **No required body**
  - make sure to use the correct item id and rental period id
- **Response (200 OK)**

```json
{
	"message": "Item returned successfully",
	"item": {
		"id": "abc123",
		"name": "Cordless Drill",
		"description": "A powerful cordless drill",
		"price": 15,
		"availability": true,
		"rentalPeriods": [
			{
				"startDate": "2025-01-08",
				"endDate": "2025-01-10",
				"id": "ca71c903-c289-4046-8790-6eb2d08cd7d1",
				"status": "returned",
				"returnedDate": "2025-01-24"
			}
		]
	}
}
```

## Error Handling

We use a global Express error handler that checks if the thrown error is an instance of HttpError. If so, we return the associated statusCode and message. Otherwise, we return a generic 500 Internal Server Error.

- Not found (404)
- Missing fields (400)
- Conflict/format error/field mismatch (409)

## Reasoning & Architecture

1. **In-Memory Storage**

- We store data in the items array rather than a database for simplicity and easy
- local testing—perfect for demos and interviews.

2. **Layered Approach**

- Service (items.service.ts): Contains business logic (filters, rent/return logic).
- Controller (items.controller.ts): Express-specific handlers that parse req and format res.
- Routes (items.routes.ts): Defines URLs and methods (GET, POST).

3. **Custom Error Handling**

- HttpError extends Error to include statusCode for returning correct HTTP codes like 404 or 400.
- A global error handler in Express checks if it’s a HttpError and responds accordingly; otherwise, defaults to 500.

4. **Availability and Status**

- Availability is a single boolean in each Item. When the item is rented, availability = false; once it’s returned or added, availability = true. However, a more reliable measure of availability would be to do some more date comparisons or to have the front end solely derive this for presentational purposes if an item is truly availible or not.
- A status property is given to each rental to track if it has been rented or returned in the respective rental period.

5. **Return Id and Returned Date**

- A return id and return date are added to each item. This could be used to give a user their rental id for easy look up and rental tracking. Also, a return date could be good for historical data/auditing purposes.

> This design is straightforward, testable, and can be extended easily for more advanced logic (e.g., partial/future rentals with date checks).
