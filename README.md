# Slack-ChatGPT

## Introduction

Small function that generates a summary of a Slack channel history using ChatGPT.
The feature is provided as a Rest API created with Azure Functions.

## Requirements

* The Slack token should have permissions to get a conversation history (https://api.slack.com/methods/conversations.history) and to join existing conversations (https://api.slack.com/methods/conversations.join). According to the documentation the usual procedure is to create a Slack app as a container for credentials (https://api.slack.com/tutorials/tracks/getting-a-token).
* It is also required to have an OpenAi account with credit to perform queries to its api (since it is a paid service).

## Run in Local

1. Install node16 and npm.
2. Clone this repo.
3. `npm install`
4. Config required ENV variables.
5. `npm start`
6. Send a GET or POST message to `http://localhost:7071/api/channel-summary` indicating the channel as a query param.

Example: `http://localhost:7071/api/channel-summary?channel=CK9DV8E2D`

## ENV Variables

* `SLACK_TOKEN` Slack auth token
* `CHAT_GPT_TOKEN` OpenAi auth token
* `CHAT_GPT_ORGANIZATION` OpenAi organization
* `CHAT_GPT_MODEL` ChatGPT model that is going to be used (default is `gpt-3.5-turbo`)

## Config ENV Variables in Local

The easiest way to configure env variables in local dev enviroment is to create a file in the root of the project with name `local.settings.json` with the following structure:

```json
// local.settings.json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "SLACK_TOKEN": "example-slack-token",
    "CHAT_GPT_TOKEN": "example-openai-token",
    "CHAT_GPT_ORGANIZATION": "org-example-name",
    "CHAT_GPT_MODEL": "gpt-3.5-turbo"
  }
}

