import { UsersProvider } from '@/context/UsersContext';
import { QuestionsProvider } from '@/context/QuestionsContext';
import { DashboardProvider } from '@/context/DashboardContext';
import { ProgressProvider } from '@/context/ProgressContext';
import { LeaderboardProvider } from '@/context/LeaderboardContext';
import { GroupsProvider } from '@/context/GroupsContext';

// Composes every page context so App can wrap the shell once. All data
// fetching, derived stats, and mutations live in these providers.
//
// The API URL deliberately lives in ./apiUrl.js instead of here. Exporting it
// from this file would make every provider import the module that imports it.
export default function AppProviders({ children }) {
  return (
    <UsersProvider>
      <QuestionsProvider>
        <DashboardProvider>
          <ProgressProvider>
            <LeaderboardProvider>
              <GroupsProvider>{children}</GroupsProvider>
            </LeaderboardProvider>
          </ProgressProvider>
        </DashboardProvider>
      </QuestionsProvider>
    </UsersProvider>
  );
}
