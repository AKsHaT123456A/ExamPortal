# Exam Portal README

## Overview
Welcome to the Exam Portal! This application is designed to facilitate online exams with built-in cheating precautions. It is developed using ReactJS and Redux for a seamless and efficient user experience. The portal includes two main sections: the Student side and the Admin side.

## Features
- ReactJS: A powerful JavaScript library for building user interfaces.
- Redux: A predictable state container for managing application state.
- Cheating Precautions:
  - No right-click functionality.
  - No Ctrl+Click functionality.
  - A tab switch counter that tracks how many times the user switches tabs. If the counter exceeds a certain limit, the test is automatically submitted.
 
## Student Side
### Pages
### Login Page

The first page the student encounters. Here, students enter their credentials to log in and access the exam portal.

### Features:
User authentication
Error handling for incorrect credentials
![image](https://github.com/pushkar-2804/Portal/assets/104600849/8371a87c-c772-4945-bce1-95ebe3318dfe)

## Instructions Page

Once logged in, students are directed to the instructions page. This page provides all necessary guidelines and rules for taking the test.
![Instructions](https://github.com/pushkar-2804/Portal/assets/104600849/be07d41d-1dbc-43c3-a531-09a02229f18c)


### Features:
Clear and concise instructions
Important information regarding cheating precautions

## Test Page

The core of the application where students take their exams. It includes various questions and interactive elements to answer them.
![Screenshot 2024-06-08 223045](https://github.com/pushkar-2804/Portal/assets/104600849/ee6ecaa6-c968-4568-8b35-41a44d1622df)


### Features:
Dynamic question rendering
Timer to keep track of the exam duration
Cheating precautions implemented (no right-click, no Ctrl+Click, tab switch counter)

## Feedback Page

After submitting the test, students are directed to the feedback page where they can provide feedback about their exam experience.
![FeedBack Page](https://github.com/pushkar-2804/Portal/assets/104600849/6edc6ae9-ce5e-4b6d-869c-b0cad926403e)


### Features:
Feedback form
Option to submit suggestions or report issues


## Installation and Setup
To get started with the Exam Portal, follow these steps:

### Clone the repository:
```git clone https://github.com/pushkar-2804/Portal.git```

### Navigate to the project directory:
``` cd Portal ```

### Install dependencies:
``` npm install ```

### Start the development server:
``` npm start ```
