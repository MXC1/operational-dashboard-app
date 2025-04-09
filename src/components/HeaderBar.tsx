import React from "react";
import "./HeaderBar.css";

interface HeaderBarProps {
  teamNames: string[];
  filterByTeam: (team: string) => void;
  selectedTeam: string | null;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ teamNames, filterByTeam, selectedTeam }) => {
  return (
    <div className="header-bar">
      <div className="header-bar-buttons">
        {teamNames.map((team : string) => (
          <button
            key={team}
            onClick={() => filterByTeam(team)}
            className={selectedTeam === team ? "selected" : ""}
          >
            {team}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeaderBar;
