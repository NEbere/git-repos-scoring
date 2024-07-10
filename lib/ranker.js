/**
 * Assigns a popularity score to each repository based on stars, forks, number of watches and recency of updates.
 * @param {Array} repositories - List of repositories to be ranked.
 * @returns {Array} - List of repositories with appended popularity scores, sorted by score and name.
 */
exports.rankRepositories = (repositories) => {
    const calculateScore = (repo) => {
        const starsScore = repo.stargazers_count;
        const forksScore = repo.forks_count;
        const watchers_count = repo.watchers_count;

        // Calculate recency score: days since last update
        const updatedAt = new Date(repo.updated_at);
        const currentDate = new Date();
        const daysSinceUpdate = Math.floor((currentDate - updatedAt) / (1000 * 60 * 60 * 24));
        const recencyScore = Math.max(0, 100 - daysSinceUpdate); // Higher score for more recent updates

        return starsScore + forksScore + watchers_count + recencyScore;
    };

    const scoredRepositories = repositories.map(repo => {
        const score = calculateScore(repo);
        return {
            ...repo,
            popularity_score: score
        };
    });

    scoredRepositories.sort((a, b) => {
        if (b.popularity_score !== a.popularity_score) {
            return b.popularity_score - a.popularity_score;
        }
        return a.full_name.localeCompare(b.full_name);
    });

    return scoredRepositories;
};
