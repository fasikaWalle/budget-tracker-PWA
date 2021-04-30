
# Budget Tracker
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
## Description

This application uses a Progressive Web Application (PWA) to enable users to add expenses and deposits to their budget with or without an internet connection.This application achieves offline functionality by making use of Service Workers and the Cache API to store static files in the users local cache.Those transactions are posted from their IndexedDB database to their MongoDB database when an internet link is identified. The total budget is then revised, and the pending object store in IndexedDB is cleared.

## Table of Content
* [Installation](#Installation)
* [Usage](#Usage)
* [Licence](#Licence)
* [Features](#Features)


## Installation
```npm install```  
## Usage

This project is deployed in heroku so you could go to the following link and test the application.

![](/public/gif/Budget-Tracker.gif)
 ## Licence
This Licence belongs to MIT 
 

## Features
- The ability to enter deposits offline.
- The ability to enter expenses offline.
- Send notification when a transaction happen.
- Offline entries should be added to the tracker when the application is brought back online.


## Questions
If you have any question about the repo, open an issue or contact me directly at [fasikaWalle](https://github.com/fasikaWalle/)

If you want to reach me for further questions please contact me through /fasikabini12@gmail.com/
    