const githubService = require('../services/githubService');
const ranker = require('../lib/ranker');

const errorCodeToMessage = {
    401: 'Invalid GitHub credentials.',
    403: 'GitHub API rate limit exceeded. Please try again later.',
    404: 'The requested resource was not found.',
    422: 'Unprocessable entity. Please check your request parameters.',
};

/**
 * Handles the request to get repositories ranked based on certain criteria.
 * It fetches repositories from GitHub based on the provided language and creation date,
 * ranks them using a custom ranking function, and returns the ranked list.
 * If parameters like creation date, per page, or page number are not specified,
 * it uses default values. In case of an error, it logs the error and returns an appropriate
 * error message and status code to the client.
 * 
 * @param {Object} req - The request object, containing query parameters for language, created date, per page, and page number.
 * @param {Object} res - The response object used to send back the ranked repositories or an error message.
 */
exports.getRankedRepos = async (req, res) => {
    const { language } = req.query;
    const created = req.query.created || "2023-01-01"; // default created if not specified
    const perPage = parseInt(req.query.perPage, 10) || 10; // default to 10 per page if not specified
    const page = parseInt(req.query.page, 10) || 1; // Always fetch first page if not specified

    try {
        const { repositories, paginationLinks } = await githubService.fetchRepositories(language, created, perPage, page);
        const rankedRepos = ranker.rankRepositories(repositories);
        res.status(200).json({
            status: 200,
            success: true,
            message: "Repositories ranked successfully.",
            page: page,
            data: { repositories: rankedRepos },
            paginationLinks
        });
    } catch (error) {
        console.log(error);
        
        const statusCode = error.response?.status || 500;
        const errorMessage = errorCodeToMessage[statusCode] || 'An unexpected error occurred.';

        res.status(statusCode).json({
            status: statusCode,
            success: false,
            message: errorMessage,
            error: {
                code: statusCode,
                description: error.message
            }
        })
    }
};

