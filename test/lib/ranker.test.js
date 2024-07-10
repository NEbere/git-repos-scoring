const ranker = require('../../lib/ranker');
const assert = require('assert');

describe('rankRepositories', () => {
    it('should rank repositories correctly based on their scores', () => {
        const repositories = [
            { stargazers_count: 30, forks_count: 25, watchers_count: 15, updated_at: '2024-06-01T00:00:00Z', full_name: 'repo1' },
            { stargazers_count: 50, forks_count: 20, watchers_count: 10, updated_at: '2024-06-01T00:00:00Z', full_name: 'repo2' },
            { stargazers_count: 40, forks_count: 20, watchers_count: 10, updated_at: '2024-06-01T00:00:00Z', full_name: 'repo3' }
        ];
        const rankedRepos = ranker.rankRepositories(repositories);
        assert.strictEqual(rankedRepos[0].full_name, 'repo2');
        assert.strictEqual(rankedRepos[1].full_name, 'repo1');
        assert.strictEqual(rankedRepos[2].full_name, 'repo3');
    });

    it('should sort repositories alphabetically if their scores are tied', () => {
        const repositories = [
            { stargazers_count: 40, forks_count: 20, watchers_count: 10, updated_at: '2024-06-01T00:00:00Z', full_name: 'repoC' },
            { stargazers_count: 40, forks_count: 20, watchers_count: 10, updated_at: '2024-06-01T00:00:00Z', full_name: 'repoA' },
            { stargazers_count: 40, forks_count: 20, watchers_count: 10, updated_at: '2024-06-01T00:00:00Z', full_name: 'repoB' }
        ];
        const rankedRepos = ranker.rankRepositories(repositories);
        assert.strictEqual(rankedRepos[0].full_name, 'repoA');
        assert.strictEqual(rankedRepos[1].full_name, 'repoB');
        assert.strictEqual(rankedRepos[2].full_name, 'repoC');
    });

    it('should give higher scores to more recently updated repositories', () => {
        const repositories = [
            { stargazers_count: 10, forks_count: 5, watchers_count: 3, updated_at: new Date().toISOString(), full_name: 'repo1' },
            { stargazers_count: 10, forks_count: 5, watchers_count: 3, updated_at: '2022-06-01T00:00:00Z', full_name: 'repo2' }
        ];
        const rankedRepos = ranker.rankRepositories(repositories);
        assert.strictEqual(rankedRepos[0].full_name, 'repo1');
        assert.strictEqual(rankedRepos[1].full_name, 'repo2');
    });

    it('should handle empty repository list', () => {
        const repositories = [];
        const rankedRepos = ranker.rankRepositories(repositories);
        assert.strictEqual(rankedRepos.length, 0);
    });
})