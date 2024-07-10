# Github Repositories Ranking

The API allows users to fetch GitHub repositories based on specified criteria such as programming language and creation date, and ranks them based on popularity metrics.
metrics used include:
- star count
- forks count
- watchers count
- last recent update

## How to run the app locally

This app requires environment variables to be set for proper operation, including a GitHub access token for API requests. These variables are stored in a .env file at the root of the project.


### Prerequisites

Before running the app locally, ensure you have the following installed:
- Node.js (version 12 or newer)
- npm

### Steps to Run the App

- clone the repo
- Locate the .env file in the root directory of the project. If it does not exist, create a new file named .env in the root directory.
- Add the GitHub access token to the .env file as follows:
```
# .env file
GITHUB_ACCESS_TOKEN=your_github_access_token_here
```

- install dependencies, run `npm install`
- start app `npm run dev` to run in dev mode with nodemon. ensure nodemon is installed globally first `npm install -g nodemon` https://www.npmjs.com/package/nodemon

- run `npm start` to run normal mode
- app will run at http://localhost:3000 or configured process.env.PORT

## Tests

Unit tests are written with mocha and assert and in the `test` folder using structure similar to app.
run test: `npm test` run all the tests in "test" folder.

## API documentation

The API currently has only on endpoint, and it is documented below.

#### Endpoint

- GET /repos/rank

#### Description

Fetches repositories from GitHub based on the specified programming language and creation date, ranks them according to a predefined ranking algorithm, and returns the ranked list of repositories along with pagination links.

**Note:** To use this API, a Github token must is needed, For information on token types allowed and instructions on how to create them, please refer to [the Github API documentation](https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-repositories).

#### Query Parameters

- language (required): The programming language to filter repositories by.
- created (optional): The creation date to filter repositories from.
Format: YYYY-MM-DD. Defaults to "2023-01-01" if not specified.
- perPage (optional): The number of repositories to return per page. Defaults to 10 if not specified.
- page (optional): The page number of the results to return. Defaults to 1 if not specified. Used for pagination so clients can parse multiple pages and can easily cache on the client side certain request and pages as needed.

#### Success Response

- Code: 200 OK
- Content: 
``` json
{
  "status": 200,
  "success": true,
  "message": "Repositories ranked successfully.",
  "page": 1,
  "data": {
    "repositories": [
      {
        "name": "Repository Name",
        "url": "Repository URL",
        "rank": "Ranking Score"
        // Additional repository details...
      }
      // More repositories...
    ]
  },
  "paginationLinks": {
    "next": "URL to next page",
    "prev": "URL to previous page",
    "first": "URL to first page",
    "last": "URL to last page"
  }
}
```

#### Error Response

- Code: 500 Internal Server Error (or other HTTP status codes depending on the error)
- Content: 
``` json
{
  "status": 500,
  "success": false,
  "message": "An unexpected error occurred.",
  "error": {
    "code": 500,
    "description": "Error description"
  }
}
```

#### Example Request

GET /repos/rank?language=javascript&created=2023-01-01&perPage=10&page=1


### TODO:

Given sometime, here some improvements or next development planned to-do:
- Add API versioning
- Introduce API caching
- run tests with coverage
- containerize application with docker