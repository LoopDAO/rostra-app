export type RuleType = {
  rule_id?: string
  name: string,
  desc: string,
  ipfsAddr?: string,
  wallet_address?: string,
  creator?: string,
  signature?: string,
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
  nft: {
    name: string,
    desc: string,
    image: string,
  }

}

export type RuleConditionType = {
  with: string
  of: string
}
