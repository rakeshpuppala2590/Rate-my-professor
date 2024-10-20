# Profscore: AI-Powered Professor Rating & Recommendation System

Profscore is an innovative AI-driven platform designed to help students find and select the best professors based on ratings and popularity. Leveraging advanced search capabilities, Profscore provides personalized professor recommendations to enhance the academic experience.

## 🚀 Live Demo & Video

- [Live Demo](https://profscore-beta.vercel.app/) 🌐
- [YouTube Demo Video](https://youtu.be/oqETFLOss9I) 🎥

## 📜 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Search Interface**: A simple, user-friendly interface for searching professors by name, department, or other criteria.
- **Sorting Options**: Easily sort professors by rating or popularity to make informed decisions.
- **AI-Powered Recommendations**: Uses AI and vector search capabilities to provide personalized professor recommendations.
- **Data Collection & Processing**: Utilizes web scraping and machine learning for data collection and processing.

## 🛠️ Technologies Used

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Node.js, Pinecone vector database
- **Data Collection**: Puppeteer, Cheerio
- **AI & Data Processing**: Hugging Face, OpenAI

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/pc9350/Rate-my-professor.git
    cd Rate-my-professor
    ```

2. Install NPM packages:

    ```bash
    npm install
    ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following environment variables:

    ```bash
    PINECONE_API_KEY=your_pinecone_api_key
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
    PINECONE_INDEX_NAME=your_index_name
    HUGGINGFACE_API_KEY=your_huggingface_api_key
    
    ```

4. Run the development server:

    ```bash
    npm run dev
    ```

   The app will be available at `http://localhost:3000`.

## 🎯 Usage

- Visit the [Live Demo](#) to explore the features.
- Use the search interface to find professors by name or department.
- Sort the results by rating or popularity to see top professors.
- Check out personalized professor recommendations based on AI analysis.

## 🔮 Future Enhancements

- **Sentiment Analysis**: Integrate sentiment analysis to categorize reviews into positive, negative, or neutral sentiments, providing more nuanced insights.
- **Multi-Language Support**: Implement multi-language support to make Profscore accessible to users worldwide, breaking language barriers.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Your Name - [chhabrapranav2001@gmail.com](mailto:chhabrapranav2001@gmail.com)

Project Link: [https://github.com/pc9350/Rate-my-professor](https://github.com/pc9350/Rate-my-professor)
