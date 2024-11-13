# **Healthcare Translation Web App with Generative AI**

(./public/projectimage.png)
_A real-time, multilingual translation app designed to facilitate communication in healthcare settings._

## **Table of Contents**

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
   - [Installation](#installation)
   - [API Configuration](#api-configuration)
5. [Usage](#usage)
6. [Project Structure](#project-structure)
7. [Deployment](#deployment)
8. [License](#license)

---

## **Overview**

This web application is a prototype built to enable real-time, multilingual communication between healthcare providers and patients. It features voice-to-text transcription, live translation, and audio playback, with a mobile-first design optimized for healthcare environments.

---

## **Features**

- **Voice-to-Text Transcription**: Converts spoken input into text using a speech recognition API.
- **Real-Time Translation**: Provides instant translations of the transcribed text in a chosen language.
- **Audio Playback**: Plays back translated text via a "Speak" button, facilitating voice responses.
- **Mobile-First Design**: Optimized for use on both mobile and desktop devices.
- **Generative AI Integration**: Utilizes AI for both language translation and development efficiency.

---

## **Tech Stack**

- **Frontend**: React, TypeScript, Next.js, Tailwind CSS
- **APIs**:
  - **Speech Recognition**: Google Speech-to-Text API
  - **Translation**: OpenAI API
  - **Audio Generation**: Custom `/api/speak` endpoint using text-to-speech

---

## **Getting Started**

### **Installation**

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Zetaii/healthcare-translation-app.git
   cd healthcare-translation-app

   ```

2. **Install Dependencies**:

   ```bash
   npm install

   ```

3. **Set Up Environment Variables**:

   - Create a `.env.local` file in the root directory.
   - Add your API keys for Google Speech-to-Text and OpenAI as shown below:

   ```plaintext
   NEXT_PUBLIC_GOOGLE_SPEECH_API_KEY=your_google_speech_api_key
   OPENAI_API_KEY=your_openai_api_key

   ```

4. **Run the Application**:

```bash
npm run dev
```

5. **Access the App**:
   - Open your browser and go to `http://localhost:3000` to view the app running locally.

---

## **Usage**

1. **Language Selection**:

   - Choose the **Input Language** and **Output Language** from the dropdown menus.

2. **Voice Input**:

   - Click the microphone button to start speaking.
   - The app will transcribe your speech in real-time.

3. **Translation**:

   - The transcript will be translated instantly into the selected output language.

4. **Audio Playback**:
   - Enable the "Auto-Speak" toggle for automatic playback or use the **Speak** button to manually play back the translated text.

---

## **Project Structure**

- **`public/`**: Contains static assets like images, icons, and fonts.
- **`src/app/`**: This is where the main application code resides.
  - **`components/`**: Contains all reusable UI components like `LanguageSelector`, `TranscriptDisplay`, and `SpeechInput`.
  - **`api/`**: Includes custom API routes for the translation and speech synthesis functionality.
  - **`page.tsx`**: The entry point for the main page of the application.
- **`styles/`**: Contains global CSS styles for the application.
- **`.env`**: Holds environment variables, such as API keys and configuration settings.
- **`package.json`**: Lists the dependencies and includes project configuration and scripts.
- **`README.md`**: This file, containing documentation and setup instructions.

## **Environment Variables**

Before running the app, ensure you have the necessary environment variables set up. Create a `.env` file in the root directory with the following configuration:

```bash
NEXT_PUBLIC_GOOGLE_API_KEY=your-google-api-key
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_TRANSLATE_API_URL=your-translation-api-url
```

## **How to Use**

### **Run the Application Locally**

After installing the dependencies and setting up the environment variables, you can run the application locally:

1. **Start the development server**:
   The server will run on `http://localhost:3000` by default. When the development server is started, the app should automatically reload as you make changes.

2. **Open the app in your browser**:
   Navigate to `http://localhost:3000` in your web browser. You should see the app running locally.

### **Using the Application**

1. **Language Selection**:

   - In the app's interface, there are two dropdown menus:
     - **Input Language**: Select the language of the speech input.
     - **Output Language**: Select the language in which you want the translation.

2. **Speech Input**:

   - Click the **Start Recording** button to begin recording your speech.
   - As you speak, your speech will be transcribed into text and displayed in the **Original Transcript** section of the app.

3. **Translation**:

   - Once the transcription is complete, the app will automatically translate the text into the selected output language.
   - The translated text will be displayed in the **Translated Transcript** section.

4. **Audio Playback**:
   - If you have enabled **Auto-Speak**, the app will automatically play the translated text via audio.
   - If not, you can manually click the **Speak** button to listen to the translated text.

### **Customization Options**

- **Auto-Speak**: Toggle this option to enable automatic speech playback of the translated text as soon as the translation is done.
- **Change Languages**: You can change the input and output languages at any time to adjust the translation and transcription settings.

## **Contributing**

We welcome contributions to this project! If you would like to help improve the app, please follow these steps:

1. **Fork the repository**:

   - Click the **Fork** button in the top-right corner of the repository page on GitHub to create your own copy of the project.

2. **Clone your fork**:

   - Clone the repository to your local machine:
     ```bash
     git clone https://github.com/Zetaii/healthcare-translation-app.git
     cd healthcare-translation-app
     ```

3. **Create a new branch**:

   - Create a new branch for your changes:
     ```bash
     git checkout -b your-branch-name
     ```

4. **Make changes**:

   - Implement the desired changes or improvements.

5. **Commit your changes**:

   - After making changes, commit them:
     ```bash
     git add .
     git commit -m "Description of your changes"
     ```

6. **Push your changes**:

   - Push your changes to your forked repository:
     ```bash
     git push origin your-branch-name
     ```

7. **Create a pull request**:
   - Open a pull request on the original repository's **main** branch for your changes to be reviewed.

### **Code of Conduct**

Please ensure that your contributions adhere to the project's code of conduct. Be respectful and collaborative with all project contributors.

### **Issue Reporting**

If you encounter any bugs or issues with the app, please open an issue in the [Issues](https://github.com/Zetaii/medicaltranslationai/issues) section of the repository. Be sure to include as much detail as possible to help us investigate the issue effectively.

### **Bug Fixes and Feature Requests**

Feel free to open an issue or create a pull request for any bugs, improvements, or new features you'd like to see in the app. We appreciate all suggestions to make the project more useful and reliable.

---
