# 🛒 বাজার দর | BazarDor

**BazarDor** is a Bengali market-price web application that helps people explore the prices of essential daily products across Bangladesh. Users can browse product categories, track price movements, compare market prices, and view detailed product information through a simple, responsive interface.

The application uses the Programming Hero BazarDor API to retrieve product and market-price information.




## ✨ Features

- **Product Catalog:** Browse essential daily products with their names, prices, units, and price changes.
- **Price Movement Tracking:** Explore products with increasing and decreasing prices through dedicated sections.
- **Category Browsing:** Find products by category and sort them by price, from lowest to highest or highest to lowest.
- **Product Details:** View current price summaries, including minimum, maximum, average, and market-wise prices.
- **User Authentication:** Register and sign in using email and password, with optional Google and GitHub authentication.
- **Protected Routes:** Restrict individual product-detail pages to authenticated users.
- **Profile Management:** View account information and update your profile name.
- **Responsive Interface:** Access the application on mobile, tablet, and desktop devices.
- **Bengali Localization:** Display product information and prices using Bengali text and numerals.




## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework and application routing |
| React 19 | Building reusable UI components |
| TypeScript | Static typing and safer development |
| Tailwind CSS 4 | Utility-first styling |
| daisyUI 5 | UI styling utilities |
| Better Auth | Authentication and session management |
| MongoDB | Persistent authentication data |
| React Hot Toast | Success and error notifications |
| React Icons | Interface icons |
| Programming Hero BazarDor API | Product and market-price data |




## 📁 Project Structure


bd-bazardor/
├── public/
│   ├── bazar-hero.png
│   └── logo-icon.png
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   ├── category/
│   │   │   └── [slug]/
│   │   ├── product/
│   │   │   └── [slug]/
│   │   ├── profile/
│   │   │   └── update/
│   │   ├── signin/
│   │   ├── signup/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── AuthButtons.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Marquee.tsx
│   │   ├── NavLinks.tsx
│   │   └── products/
│   │       ├── ProductCard.tsx
│   │       └── ProductSections.tsx
│   │
│   ├── lib/
│   │   ├── auth-client.ts
│   │   ├── auth.ts
│   │   ├── products-api.ts
│   │   ├── safe-callback.ts
│   │   └── type.ts
│   │
│   └── proxy.ts
│
├── .gitignore
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
└── README.md





## 🚀 Getting Started

Follow these steps to run BazarDor locally.


### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm
- A MongoDB database (for authentication)

### 1. Clone the repository

```bash
git clone https://github.com/JamilurCodes/bd-bazardor.git

cd bd-bazardor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=bd-bazardor

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_secure_random_secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# GitHub OAuth (Optional)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=



**Important:**
- `MONGODB_URI`, `BETTER_AUTH_URL`, and `BETTER_AUTH_SECRET` are required.
- `MONGODB_DB_NAME` is optional and defaults to `bd-bazardor`.
- Google and GitHub OAuth credentials are optional. Configure both credentials for a provider to enable it.
- Never commit your `.env.local` file or expose your credentials publicly.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.




## 📡 API Integration

BazarDor retrieves product and market-price information from the Programming Hero API.

**Base URL:**


https://openapi.programming-hero.com/api/bazardor


| Endpoint | Description |

| `/products` | Retrieve all products |
| `/products?category=chal` | Retrieve products by category |
| `/products/1` | Retrieve a product by ID |
| `/categories` | Retrieve available categories |
| `/categories/chal` | Retrieve a specific category |

Product data is handled centrally through `src/lib/products-api.ts`, while the corresponding TypeScript interfaces are maintained in `src/lib/type.ts`.

API requests use a five-minute revalidation interval.



## 🔐 Authentication

BazarDor uses Better Auth with MongoDB for authentication and session management.

Supported authentication methods:

- Email and password
- Google OAuth (when configured)
- GitHub OAuth (when configured)

Authentication-related routes:

| Route | Description |
|---|---|
| `/signin` | User sign-in |
| `/signup` | User registration |
| `/profile` | View account information |
| `/profile/update` | Update profile information |
| `/api/auth/[...all]` | Better Auth API handler |

Individual product-detail pages require authentication.



## 🌐 Deployment

BazarDor can be deployed using [Vercel](https://vercel.com/).

1. Push the project to GitHub.
2. Import the GitHub repository into Vercel.
3. Configure the required environment variables in Vercel.
4. Update `BETTER_AUTH_URL` to your production domain.
5. Configure OAuth callback URLs if Google or GitHub authentication is enabled.
6. Deploy the application.
7. Test authentication, product routes, and page refreshes on the deployed website.



## 🔗 Project Links

- **Live Website:** [https://bangladesh-bazar-dor.vercel.app](#)
- **GitHub Repository:** [bd-bazardor](https://github.com/JamilurCodes/bd-bazardor)



## 👨‍💻 Author

**Jamilur Rahman Dilwar**

GitHub: [@JamilurCodes](https://github.com/JamilurCodes)



*BazarDor — প্রয়োজনীয় পণ্যের দাম এক নজরে।*

*সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়.*