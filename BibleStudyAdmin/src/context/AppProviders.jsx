import { UsersProvider } from '@/context/UsersContext';
import { QuestionsProvider } from '@/context/QuestionsContext';
import { DashboardProvider } from '@/context/DashboardContext';
import { ProgressProvider } from '@/context/ProgressContext';
import { LeaderboardProvider } from '@/context/LeaderboardContext';
import { GroupsProvider } from '@/context/GroupsContext';

// The single source for the backend URL — every admin context imports this
// instead of declaring its own. Override per environment with VITE_API_URL
// (e.g. a tunnel URL); otherwise it points at the local Laravel server.
export const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Composes every page context so App can wrap the shell once. All data
// fetching, derived stats, and mutations live in these providers.
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
