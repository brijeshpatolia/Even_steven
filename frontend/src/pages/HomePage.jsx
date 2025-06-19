import { CreateGroupForm } from "../components/organisms/CreateGroupForm";
import { GroupList } from "../components/organisms/GroupList";
import { UserBalanceChecker } from "../components/organisms/UserBalanceChecker";

export const HomePage = () => {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white p-8">
      <header className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-bold text-green-400">
          Even_Steven
        </h1>
        <p className="text-gray-400 mt-2">Track your shared expenses with ease.</p>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: CreateGroupForm and UserBalanceChecker, stacked and sharing height */}
        <div className="flex flex-col gap-8"> {/* This is the first grid column */}
          <div className="flex-1 flex justify-center"> {/* Container for CreateGroupForm, takes half height */}
            <CreateGroupForm />
          </div>
          <div className="flex-1 flex justify-center"> {/* Container for UserBalanceChecker, takes half height */}
            <UserBalanceChecker />
          </div>
        </div>

        {/* Right Column: GroupList */}
        <div className="flex justify-center"> {/* This is the second grid column */}
          <GroupList />
        </div>
      </main>
    </div>
  );
}