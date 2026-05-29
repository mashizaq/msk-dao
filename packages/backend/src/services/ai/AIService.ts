import { OpenAI } from 'openai';
import { User } from '../../models/User';
import { logger } from '../../utils/logger';

interface Recommendation {
  category: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}

class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate personalized recommendations for a user
   */
  async generateRecommendations(userId: string): Promise<Recommendation[]> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const userContext = `
        User: ${user.username}
        Contribution Credits: ${user.contributionCredits}
        Voting Power: ${user.governance.votingPower}
        Proposals Created: ${user.governance.proposalsCreated}
        Votes Participated: ${user.governance.votesParticipated}
        Role: ${user.role}
        SOL Balance: ${user.rewards.solBalance}
        DOGE Balance: ${user.rewards.dogeBalance}
      `;

      const prompt = `
You are an AI advisor for the Mars Society Kenya DAO. Based on the following user profile, 
generate 3-5 personalized recommendations to help them maximize their contribution and engagement.

User Profile:
${userContext}

Provide recommendations in the following JSON format:
[
  {
    "category": "governance|treasury|project|learning",
    "suggestion": "specific actionable suggestion",
    "priority": "high|medium|low",
    "reasoning": "why this is important for this user"
  }
]

Respond with only valid JSON array.
      `;

      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [{
          role: 'user',
          content: prompt,
        }],
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || '[]';
      const recommendations = JSON.parse(content) as Recommendation[];

      return recommendations;
    } catch (error) {
      logger.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Analyze member engagement and predict trends
   */
  async analyzeEngagement(userId: string): Promise<{
    engagementScore: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    analysis: string;
  }> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Calculate engagement score (0-100)
      const engagementScore = Math.min(100, 
        (user.governance.votesParticipated * 5) + 
        (user.governance.proposalsCreated * 10) + 
        (user.contributionCredits * 0.5)
      );

      const prompt = `
Provide a brief analysis (2-3 sentences) of the engagement level for a DAO member with these metrics:
- Contribution Credits: ${user.contributionCredits}
- Proposals Created: ${user.governance.proposalsCreated}
- Votes Participated: ${user.governance.votesParticipated}
- Engagement Score: ${engagementScore}/100

Respond with only the analysis text, no JSON.
      `;

      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [{
          role: 'user',
          content: prompt,
        }],
        temperature: 0.5,
      });

      const analysis = response.choices[0]?.message?.content || '';

      // Determine trend
      let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
      if (user.governance.votesParticipated > user.governance.proposalsCreated * 2) {
        trend = 'increasing';
      } else if (user.governance.votesParticipated < user.governance.proposalsCreated) {
        trend = 'decreasing';
      }

      return {
        engagementScore,
        trend,
        analysis,
      };
    } catch (error) {
      logger.error('Error analyzing engagement:', error);
      throw error;
    }
  }

  /**
   * Generate proposal summary
   */
  async summarizeProposal(proposalText: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [{
          role: 'user',
          content: `Summarize the following proposal in 2-3 sentences for the Mars Society Kenya DAO:\n\n${proposalText}`,
        }],
        temperature: 0.5,
        max_tokens: 150,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Error summarizing proposal:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
