const express = require('express');
const repoController = require('../controllers/repoController');
const router = express.Router();


/**
 * Sets up a GET route to handle requests for ranking repositories.
 * The route expects query parameters such as 'query' for the search term,
 * 'language' for the programming language of the repositories, 'perPage' for the number of repositories
 * per page, and 'page' for the maximum number repos per page and page number (for pagination)
 * 
 * Example URL: http://localhost:3000/repos/rank?query=nodejs&language=javascript&perPage=15&page=3
 */
router.get('/rank', repoController.getRankedRepos);

module.exports = router;
