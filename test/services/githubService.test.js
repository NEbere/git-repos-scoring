const githubService = require('../../services/githubService');
const assert = require('assert');
const sinon = require('sinon');
const axios = require('axios');



describe('fetchRepositories', () => {
    let axiosGetStub;

    beforeEach(() => {
        axiosGetStub = sinon.stub(axios, 'get');
    });

    afterEach(() => {
        axiosGetStub.restore();
    });

    it('should fetch repositories successfully', async () => {
        const mockResponse = {
            data: { items: [{ full_name: 'repo1' }, { full_name: 'repo2' }] },
            headers: { link: '<https://api.github.com/search/repositories?page=2>; rel="next"' }
        };
        axiosGetStub.resolves(mockResponse);

        const { repositories, paginationLinks } = await githubService.fetchRepositories('javascript', '2024-01-01', 2, 1);

        assert.strictEqual(repositories.length, 2);
        assert.strictEqual(repositories[0].full_name, 'repo1');
        assert.strictEqual(repositories[1].full_name, 'repo2');
        assert.strictEqual(paginationLinks.next, 'https://api.github.com/search/repositories?page=2');
    });

    it('should handle GitHub API error', async () => {
        const mockError = {
            response: { status: 404, data: { message: 'Not Found' } }
        };
        axiosGetStub.rejects(mockError);

        try {
            await githubService.fetchRepositories('javascript', '2024-01-01', 2, 1);
            assert.fail('Expected error to be thrown');
        } catch (error) {
            assert.strictEqual(error.response.status, 404);
        }
    });

    it('should handle no response from GitHub API', async () => {
        const mockError = {
            request: {}
        };
        axiosGetStub.rejects(mockError);

        try {
            await githubService.fetchRepositories('javascript', '2024-01-01', 2, 1);
            assert.fail('Expected error to be thrown');
        } catch (error) {
            assert.strictEqual(error.request, mockError.request);
        }
    });

    it('should handle request setup error', async () => {
        const mockError = {
            message: 'Network Error'
        };
        axiosGetStub.rejects(mockError);

        try {
            await githubService.fetchRepositories('javascript', '2024-01-01', 2, 1);
            assert.fail('Expected error to be thrown');
        } catch (error) {
            assert.strictEqual(error.message, 'Network Error');
        }
    });

    it('should handle empty Link header', async () => {
        const mockResponse = {
            data: { items: [{ full_name: 'repo1' }] },
            headers: {}
        };
        axiosGetStub.resolves(mockResponse);

        const { repositories, paginationLinks } = await githubService.fetchRepositories('javascript', '2024-01-01', 2, 1);

        assert.strictEqual(repositories.length, 1);
        assert.strictEqual(repositories[0].full_name, 'repo1');
        assert.deepStrictEqual(paginationLinks, {});
    });
})