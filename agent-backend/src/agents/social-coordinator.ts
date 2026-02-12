/**
 * Social Coordinator: polls for lifelines, XMTP group messages. Handles poll lifeline and notifies Game Master.
 */

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface LifelinePoll {
  pollId: string;
  question: string;
  options: PollOption[];
  createdAt: number;
}

const polls = new Map<string, LifelinePoll>();

export function createPoll(pollId: string, question: string, options: string[]): LifelinePoll {
  const poll: LifelinePoll = {
    pollId,
    question,
    options: options.map((label, i) => ({ id: `opt-${i}`, label, votes: 0 })),
    createdAt: Date.now(),
  };
  polls.set(pollId, poll);
  return poll;
}

export function votePoll(pollId: string, optionId: string): LifelinePoll | null {
  const poll = polls.get(pollId);
  if (!poll) return null;
  const opt = poll.options.find((o) => o.id === optionId);
  if (opt) opt.votes += 1;
  return poll;
}

export function getPoll(pollId: string): LifelinePoll | null {
  return polls.get(pollId) ?? null;
}
