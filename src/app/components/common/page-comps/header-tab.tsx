type Tab = {
  name: string
}

type HeaderTabsProps = {
  tabs: Tab[]
  activeTab: string
  setActiveTab: (tab: string) => void
}

function HeaderTabs({ tabs, setActiveTab, activeTab }: HeaderTabsProps) {
  return (
    <div className="flex h-[45px] items-center border-b border-[#DEDEDE]">
      {tabs.map((tab, i) => (
        <div
          key={i}
          onClick={() => setActiveTab(tab.name)}
          className={`h-full px-[30px] cursor-pointer flex items-center gap-2 min-w-[134px] ${
            tab.name === activeTab
              ? "text-primary border-b-2 border-primary"
              : "text-light"
          }`}
        >
          <h1 className="m-auto text-[16px]">{tab.name}</h1>
        </div>
      ))}
    </div>
  )
}

export default HeaderTabs
