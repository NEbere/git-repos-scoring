const repoController = require('../../controllers/repoController');
const ranker = require('../../lib/ranker');
const githubService = require('../../services/githubService');
const assert = require('assert');
const sinon = require('sinon');
const axios = require('axios');


describe('Repo Controller - getRankedRepos', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            query: {
                language: 'javascript',
                created: '2023-01-01',
                perPage: 10,
                page: 1
            }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        next = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should fetch and rank repositories successfully', async () => {
        const mockRepositories = [{ id: 1, full_name: 'repo1', stargazers_count: 10 }, { id: 2, full_name: 'repo2', stargazers_count: 5 }];
        const mockRankedRepos = [{ id: 1, full_name: 'repo1', popularity_score: 15 }, { id: 2, full_name: 'repo2', popularity_score: 12 }];

        const fetchRepositoriesStub = sinon.stub(githubService, 'fetchRepositories').resolves({ repositories: mockRepositories, paginationLinks: {} });
        const rankRepositoriesStub = sinon.stub(ranker, 'rankRepositories').returns(mockRankedRepos);

        await repoController.getRankedRepos(req, res, next);

        sinon.assert.calledOnce(fetchRepositoriesStub);
        sinon.assert.calledOnce(rankRepositoriesStub);
        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledWith(res.json, {
            status: 200,
            success: true,
            message: "Repositories ranked successfully.",
            page: req.query.page,
            data: { repositories: mockRankedRepos },
            paginationLinks: {}
        });
    });

    it('should handle GitHub API error', async () => {
        const mockError = new Error('GitHub API error');
        mockError.response = { status: 404 };
        sinon.stub(githubService, 'fetchRepositories').rejects(mockError);

        await repoController.getRankedRepos(req, res, next);

        sinon.assert.calledWith(res.status, 404);
        sinon.assert.calledWith(res.json, {
            status: 404,
            success: false,
            message: "The requested resource was not found.",
            error: {
                code: 404,
                description: 'GitHub API error'
            }
        });
    });

    it('should handle unknown error', async () => {
        const mockError = new Error('Unknown error');
        sinon.stub(githubService, 'fetchRepositories').rejects(mockError);

        await repoController.getRankedRepos(req, res, next);

        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledWith(res.json, {
            status: 500,
            success: false,
            message: "An unexpected error occurred.",
            error: {
                code: 500,
                description: 'Unknown error'
            }
        });
    });
})