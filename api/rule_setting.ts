export type RuleType = {
  name: string,
  desc: string,
  creator: string,
  signature: string,
  timestamp: number,
  action: {
    // github_discussion, github_commit, github_star
    // twitter_tweet, twitter_follow, twitter_retweet, twitter_hashtag
    // discord_join, discord_message
    type: string,
    url: string,
    condition: Array<RuleConditionType>,
    start_time: Date,
    end_time: Date,
  }
  nft: string,
}

export type RuleConditionType = {
  with: string
  of: string
}
