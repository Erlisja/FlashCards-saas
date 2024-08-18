# MemoGenie

MemoGenie is a flashcard generation web application built with Node.js. Designed to enhance learning and memorization, MemoGenie offers a seamless experience for creating, saving, and reviewing flashcards. It includes robust features like user authentication, subscription management, and local storage tracking, making it a powerful tool for both students and professionals.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)


## Features

- **User Authentication:** Powered by [Clerk](https://clerk.dev/), MemoGenie provides secure and efficient sign-up, login, and logout functionalities.
  
- **Subscription Management:** Integrated with [Stripe](https://stripe.com/), MemoGenie offers two subscription plans:
  - **Basic Plan:** $5/month, allows up to 100 flashcards/month, with limited storage.
  - **Pro Plan:** $10/month, offers unlimited flashcards and storage, along with priority support.
  
- **Flashcard Creation:** Users can easily create flashcards with a front and back side, organize them by topic, and save them to their account.
  
- **Local Storage Tracking:** The app tracks the number of flashcards generated using local storage, ensuring users are aware of their usage limits.

- **Responsive Design:** The app is designed to work seamlessly on various screen sizes, ensuring a great user experience on both desktop and mobile devices.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Erlisja/FlashCards-saas.git
   cd flashcards-saas
2. **Set up environment variables:

Create a .env file in the root of the project and add the following environment variables:
Run the development server:
```bash
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=<your_tripe_public_key>
STRIPE_SECRET_KEY = <your_secret_key>
OPENAI_API_KEY= <your_openai_api_key>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= <your_next_public_clerk_key>
CLERK_SECRET_KEY=<your_clerk_secret_key>
```
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

### Usage

#### Sign Up/Log In:

- New users can sign up, and existing users can log in using the authentication system powered by Clerk.

#### Create Flashcards:

- Navigate to the flashcards creation page, enter the topic, front, and back content, and save your flashcards.

#### Manage Subscriptions:

- Users can subscribe to the Basic or Pro plan via Stripe to unlock additional features and storage.

#### Track Flashcard Generation:

- The app tracks the number of flashcards generated using local storage and alerts the user when they reach their limit.

  ### Technologies Used

- **Node.js**: JavaScript runtime environment for building the backend.
- **Next.js**: React framework for building server-side rendered applications.
- **Clerk**: User authentication and management.
- **Stripe**: Payment processing and subscription management.
- **Firebase Firestore**: Cloud database to store user flashcards.
- **Material-UI**: UI framework for building responsive interfaces.
- **Local Storage**: To track flashcard generation and usage limits.
- **OpenAi API** : To generate flashcards

### Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a pull request.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

