## Inspiration
The inspiration for this project is that I have been curious about how AI helps developers in code in general and what things it can do. I got this curiosity when I saw the GitHub Copilot in action from people demoing on social media.

## What it does
Sidekick can analyze a function's complexity. For other features, most of them were made with conveniences feature or as a shortcut for their core purpose. Please see the project's [README.md for details](https://github.com/lanly-dev/vscode-sidekick/blob/master/README.md).

## How I built it
I only use Visual Studio Code APIs and the [Nodejs client of OpenAI](https://www.npmjs.com/package/openai) for the project. I learned the APIs through the examples that VSCode and OpenAI provided.

## Challenges I ran into
For the major one, I am still not sure how to configure the parameter to tune the more desired result I could get from the OpenAI. For other things, one I could think up is how to achieve better UX with the VSCode extension APIs.

## Accomplishments that I am proud of
The extension is capable of what it intends to do. However, the result of its action that it got from OpenAI is still lacking.

## What I learned
A lot! For the technical side, I learned a bunch of Visual Studio Code APIs. On the abstraction side, I realized that AI still has some limits on things that I want it to assist with, or it could be that I don't know how to input a better prompt for it to understand.

## What's next for Sidekick
This project serves as a prototype for me to explore how I could leverage AI to generate code snippets conveniently. It was fun to learn about new VSCode APIs and the results from OpenAI. I don't have any plan for what to do next with the Sidekick extension unless I can improve the query result from OpenAI APIs.
