import BalanceList from "shared/components/Budget/BalanceList";
import TransactionsList from "shared/components/TransactionsList";

const UserBudget = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex-1">
          <BalanceList className="h-full" />
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex-1">
            <TransactionsList className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBudget;
