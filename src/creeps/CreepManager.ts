import { ExtendedCreepList } from "../types/CreepsList";
import ExtendedCreep, { CreepType } from "./ExtendedCreep";
//@ts-ignore
import profiler from "../utils/screeps-profiler";

class CreepManager {
  room: Room;
  creeps: ExtendedCreepList;
  getCreeps: (creepType?: CreepType) => ExtendedCreepList;
  run: (creepType?: CreepType) => void;
  private runCreeps: () => void;

  constructor(room: Room) {
    this.room = room;
    let creepList = {} as ExtendedCreepList;
    room.creeps.mine.forEach(creep => {
      creepList[creep.name] = creep;
    });
    this.creeps = creepList;

    this.getCreeps = (creepType?: CreepType) => {
      if (!creepType) return this.creeps;
      else {
        const filteredCreeps = {} as ExtendedCreepList;
        _.forEach(this.creeps, creep => {
          if (creep.type === creepType) {
            filteredCreeps[creep.name] = creep;
          }
        });
        return filteredCreeps;
      }
    };

    let _run = (creepType?: CreepType) => {
      let total = 0;
      const creeps = creepType ? this.getCreeps(creepType) : this.creeps;
      const currentStatus = _.reduce(
        creeps,
        (memo, creep) => {
          for (let [state, handler] of Object.entries(creep.states as any)) {
            if (!memo[state]) memo[state] = 0;
            if ((handler as any).code === creep.memory.state) {
              memo[state] = (memo[state] || 0) + 1;
              total++;
            }
          }
          return memo;
        },
        {} as any
      );
      global.log(`CreepManager: ${this.room} - ${JSON.stringify(currentStatus)}`);
      global.log(`CreepManager: Total Creeps: ${total}`);

      this.runCreeps();
    };
    if (profiler) _run = profiler.registerFN(_run, "CreepManager.run");
    this.run = _run;

    this.runCreeps = () => {
      for (let creepName in this.creeps) {
        const creep = setMemory(this.creeps[creepName]);
        const state = creep.getState();
        state.run(room);
        state.transition(room);
      }
    };
  }
}
const setMemory = (creep: ExtendedCreep) => {
  !Object(creep.memory).hasOwnProperty("state") &&
    (creep.memory.state = creep.states?.init.code);

  return creep;
};

export default CreepManager;
