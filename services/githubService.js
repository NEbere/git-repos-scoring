const axios = require('axios');

// Access environment variables
const githubApiUrl = "https://api.github.com/search/repositories";
const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN;

/**
 * Logs different types of errors encountered during API requests to GitHub.
 * It distinguishes between errors from the GitHub API itself, errors due to no response,
 * and errors related to setting up the request.
 * @param {Object} error - The error object received from a failed API request.
 */
function logApiError(error) {
    if (error.response) {
        // GitHub API error (4xx or 5xx response)
        console.log(`GitHub API error: ${error.response.status} ${error.response.data.message}`);
    } else if (error.request) {
        // No response received
        console.log(`No response received from GitHub API ${JSON.stringify(error)}`);
    } else {
        // Request setup error
        console.log(`Error setting up request to GitHub API: ${error.message}`);
    }
}

/**
 * Parses the 'Link' header from GitHub API responses to extract pagination links.
 * The 'Link' header contains URLs for navigation (next, prev, first, last) as a string,
 * which this function parses into an object for easier access.
 * @param {string} header - The 'Link' header string from the GitHub API response.
 * @returns {Object} An object containing the parsed links, keyed by their relation (rel) to the current page.
 */
function parseLinkHeader(header) {
    if (!header || header.length === 0) {
        return {};
    }

    const links = {};

    // Split parts by comma and parse each part into a named link
    header.split(',').forEach(part => {
        const section = part.split(';');
        if (section.length !== 2) {
            throw new Error("section could not be split on ';'");
        }
        const url = section[0].replace(/<(.*)>/, '$1').trim();
        const name = section[1].replace(/rel="(.*)"/, '$1').trim();
        links[name] = url;
    });

    return links;
}

/**
 * Fetches repositories from GitHub based on the specified language and creation date.
 * It uses the GitHub Search API (https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-repositories)
 * to find repositories matching the criteria and handles pagination
 * by parsing the 'Link' header. Errors during the API request are logged and rethrown.
 * @param {string} language - The programming language to filter repositories by.
 * @param {string} created - The creation date to filter repositories from. Format: YYYY-MM-DD.
 * @param {number} perPage - The number of repositories to return per page.
 * @param {number} page - The page number of the results to return.
 * @returns {Promise<Object>} An object containing the list of repositories and pagination links.
 */
exports.fetchRepositories = async (language, created, perPage, page) => {
    const params = {
        q: `language:${language} created:>=${created}`,
        per_page: perPage,
        page: page,
    };
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${githubAccessToken}`,
    };

    try {
        const response = await axios.get(githubApiUrl, { params, headers });
        const repositories = response.data.items || [];
        const linkHeader = response.headers['link'];
        const paginationLinks = parseLinkHeader(linkHeader);

        return { repositories, paginationLinks };
    } catch (error) {
        logApiError(error); 
        throw error; // Rethrow the error for callers to handle as needed
    }
};
