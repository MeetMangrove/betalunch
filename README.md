# betahausPairing
A web app to pairing people randomly with their email adress.

## How to run

- clone this repo
- `meteor npm i` (to install dependencies)
- set environment variables (see below)
- set your timezone in settings.json
- `meteor --settings settings.json` (to run locally)

# Required environment variables

- `MAIL_URL`: URL of your SMTP server (for sending emails), including credentials
- `FROM_EMAIL`: email address of the sender
