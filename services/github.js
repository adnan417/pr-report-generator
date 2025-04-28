const axios = require('axios');

class Github {
  constructor(repoOwner, repoName) {
    this.repoName = repoName;
    this.repoOwner = repoOwner;
    this.baseUrl = "https://api.github.com/repos";
    this.headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json'
    };
  }

  async fetchBranches() {
    const url = `${this.baseUrl}/${this.repoOwner}/${this.repoName}/branches`;

    try {
      const res = await axios.get(url, { headers: this.headers });
      return res.data;
    } catch (error) {
      console.error("Error fetching branches:", this._formatError(error));
      return [];
    }
  }

  //All PRs (Closed and Open)
  async fetchPRs(start, end) {
    const url = `${this.baseUrl}/${this.repoOwner}/${this.repoName}/pulls?state=all&base=develop&per_page=100`;

    try {
      const res = await axios.get(url, { headers: this.headers });
      return res.data.filter(pr => pr.updated_at && pr.updated_at >= start && pr.updated_at <= end);
    } catch (error) {
      console.error("Error fetching PRs:", this._formatError(error));
      return [];
    }
  }

  //All PRs (Rejected and Merged)
  async fetchClosedPRs(start, end) {
    const url = `${this.baseUrl}/${this.repoOwner}/${this.repoName}/pulls?state=closed&base=develop&per_page=100`;

    try {
      const res = await axios.get(url, { headers: this.headers });
      return res.data.filter(pr => pr.updated_at && pr.updated_at >= start && pr.updated_at <= end);
    } catch (error) {
      console.error("Error fetching Closed PRs:", this._formatError(error));
      return [];
    }
  }

  //All PRs (Rejected)
  async fetchRejectedPRs(start, end) {
    const url = `${this.baseUrl}/${this.repoOwner}/${this.repoName}/pulls?state=closed&base=develop&per_page=100`;

    try {
      const res = await axios.get(url, { headers: this.headers });
      return res.data.filter(pr => !pr.merged_at && pr.updated_at >= start && pr.updated_at <= end);
    } catch (error) {
      console.error("Error fetching rejected PRs:", this._formatError(error));
      return [];
    }
  }

  //All PRs (Merged)
  async fetchMergedPRs(start, end) {
    const url = `${this.baseUrl}/${this.repoOwner}/${this.repoName}/pulls?state=closed&base=develop&per_page=100`;

    try {
      const res = await axios.get(url, { headers: this.headers });
      return res.data.filter(pr => pr.merged_at && pr.updated_at >= start && pr.updated_at <= end);
    } catch (error) {
      console.error("Error fetching merged PRs:", this._formatError(error));
      return [];
    }
  }

  async getPRDetails(prNumber) {
    const url = `${this.baseUrl}/${this.repoOwner}/${this.repoName}/pulls/${prNumber}`;

    try {
      const res = await axios.get(url, { headers: this.headers });
      return res.data;
    } catch (error) {
      console.error(`Error getting details for PR #${prNumber}:`, this._formatError(error));
      return [];
    }
  }

  async getPRReviews(prNumber) {
    const url = `${this.baseUrl}/${this.repoOwner}/${this.repoName}/pulls/${prNumber}/reviews`;

    try {
      const res = await axios.get(url, { headers: this.headers });
      return res.data;
    } catch (error) {
      console.error(`Error fetching reviews for PR #${prNumber}:`, this._formatError(error));
      return [];
    }
  }

  async getPRComments(prNumber) {
    const url = `${this.baseUrl}/${this.repoOwner}/${this.repoName}/issues/${prNumber}/comments`;

    try {
      const res = await axios.get(url, { headers: this.headers });
      return res.data;
    } catch (error) {
      console.error(`Error fetching comments for PR #${prNumber}:`, this._formatError(error));
      return [];
    }
  }

  // Private helper to format error messages
  _formatError(error) {
    if (error.response) {
      return `Status: ${error.response.status}, Message: ${error.response.data.message}`;
    } else if (error.request) {
      return "No response received from GitHub API.";
    } else {
      return error.message;
    }
  }
}

module.exports = Github;
