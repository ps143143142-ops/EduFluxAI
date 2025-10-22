import { ExternalAccount } from '../types';

/**
 * Simulates an API call to fetch updated stats for a competitive programming account.
 * @param account The account to sync.
 * @returns A promise that resolves with the updated account.
 */
export const syncAccount = (account: ExternalAccount): Promise<ExternalAccount> => {
  console.log(`Syncing ${account.platform} for ${account.username}...`);
  
  return new Promise(resolve => {
    setTimeout(() => {
      const updatedAccount: ExternalAccount = {
        ...account,
        stats: {
          // Add a random small number to simulate progress
          solvedCount: account.stats.solvedCount + Math.floor(Math.random() * 5),
          // Simulate slight rank change
          ranking: Math.max(1, account.stats.ranking - Math.floor(Math.random() * 50)),
        },
        lastSynced: new Date().toISOString(),
      };
      console.log(`Sync complete for ${account.platform}. New stats:`, updatedAccount.stats);
      resolve(updatedAccount);
    }, 1500); // Simulate a 1.5-second network delay
  });
};
