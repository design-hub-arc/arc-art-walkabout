![Markdown Banner](/image/markdown-banner.png)

![GitHub repo size](https://img.shields.io/github/repo-size/gibstock/pwatest)
![GitHub last commit](https://img.shields.io/github/last-commit/gibstock/pwatest)
![GitHub top language](https://img.shields.io/github/languages/top/gibstock/pwatest)

---
## Table of Contents

* [Introduction](#introduction)
* [Motivation](#motivation)
* [PWA](#pwa)
  * [Manifest File](#simple-manifestjson-file)
* [Known Issues](#known-issues)
* [Testing](#for-testing)
___
## Introduction 
This project was an exploration into Progressive Web App (pwa) technologies as well as leveraging mobile GPS. It was intentionally built without a backend framework to be as lightweight as possible.

---

## Motivation
The idea was to see if we could design an app that would trigger a poem when the user entered predetermined zones along the Davis bike path. Utilizing the pre-caching techniques of the PWA to help reach areas that might be cut off from strong data connections.

---

## PWA
The two essential parts to this equation are the manifest and the service-worker files. These are needed to pass the audits to be categorized as a progressive web app and eligible for installation on the home screen. 

### Simple Manifest.json file
![Manifest.json](/image/manifest.png)
---



## Known Issues
[ ] Need to dynamically set variables instead of hard-coding each one

---

## For Testing

If you are a part of the Design Hub and want to test this locally:
1. Download the zip file
1. Unzip into your local directory
1. Open the folder with your code editor of choice (I'm using VS Code)
1. Run it on your local server (I'm using Live-Server VS Code extension)
1. The UI is optimized for mobile devices so go into your dev tools and choose the mobile or responsive layout
1. You can see the cache being stored in the "Application" tab under the "Cache Storage" option.
### To check the tracking functionality
* Access the "More Tools" menu option (in Chrome) by selecting the 3 dots.
* Select "Sensors" to bring up the option to simulate GPS locations.
* Turn the toggle on the app to "On" and set different locations to see the updated output.
___

I'm open to design feedback!