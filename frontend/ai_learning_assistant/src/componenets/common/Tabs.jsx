const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full">
      <div className="relative border-b-2 border-slate-100">
        <nav className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const tabId = tab.id ?? tab.name;
            const isActive = activeTab === tabId;

            return (
              <button
                key={tabId}
                type="button"
                className={`relative pb-4 px-2 md:px-6 text-sm font-semibold transition-all duration-200 ${
                  isActive ? 'text-emerald-600' : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => setActiveTab(tabId)}
              >
                <span className="relative z-10">{tab.label ?? tab.name}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/25" />
                )}
                {isActive && (
                  <div className="absolute inset-0 bg-linear-to-b from-emerald-50/50 to-transparent rounded-t-xl -z-10" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="py-6">
        {tabs.map((tab) => {
          const tabId = tab.id ?? tab.name;
          if (tabId !== activeTab) return null;

          return (
            <div key={tabId} className="animate-in fade-in duration-300">
              {typeof tab.content === 'function' ? tab.content() : tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
