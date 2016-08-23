# betalunch
A web app to pairing people randomly with their email adress.

## How to run

- clone this repo
- `meteor npm i` (to install dependencies)
- set environment variables (see below)
- set your timezone and email in settings.json
- `MAIL_URL=yoursmtpurl meteor --settings settings.json` (to run locally)

# Required environment variables

- `MAIL_URL`: URL of your SMTP server (for sending emails), including credentials

# Deployement on Scalingo

- create an account on Scalingo
    -> See https://scalingo.com/
- in the repo, install Scalingo:
    -> See http://doc.scalingo.com/app/command-line-tool.html
- deploy meteor app with mongoDB addons:
    -> See http://doc.scalingo.com/languages/javascript/nodejs/getting-started-with-meteor/
- setup settings and environement variables:
    -> See http://doc.scalingo.com/languages/javascript/nodejs/meteor/