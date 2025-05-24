import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // React Router import
import { HorseRaceGameManager, IObserver } from "./HorseGame";

const manager = new HorseRaceGameManager();

const HorseRaceGame: React.FC = () => {
  const [state, setState] = useState(manager.getState());
  const navigate = useNavigate(); // hook für Navigation

  useEffect(() => {
    const observer: IObserver = {
      update: () => {
        setState(manager.getState());
      },
    };
    manager.addObserver(observer);

    return () => {
      manager.removeObserver(observer);
    };
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">🐎 Virtuelles Pferderennen</h1>
      <p className="mb-4">{state.message}</p>

      <div className="space-y-2 mb-4">
        {state.horses.map((horse, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="w-20">{horse.name}</span>
            <div className="flex-1 bg-gray-200 h-4 rounded relative">
              <div
                className="bg-green-500 h-4 rounded"
                style={{ width: `${horse.position * 10}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => manager.startRace()}
          disabled={state.isRaceRunning}
        >
          Rennen starten
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => manager.resetRace()}
        >
          Zurücksetzen
        </button>
      </div>

      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => navigate("/home")}
      >
        Back to Lobby
      </button>
    </div>
  );
};

export default HorseRaceGame;
