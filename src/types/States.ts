export enum StateCode {
  INIT = -1,
  HARVEST = 0,
  LOAD = 1,
  UPGRADE = 2,
  BUILD = 3,
  LOADSELF = 4,
  ATTACK = 5,
  HAUL = 6,
  LOAD_STRUCTURE = 7,
  REPAIR = 8,
  HEAL = 9,
  IDLE = 10,
  SPAWNING = 11
}

export interface BaseCreepStates {
  init: CreepState;
}

export type CreepState = {
  code: StateCode;
  run: (room: Room) => void;
  transition: (room: Room) => void;
};

// export interface BaseStructureStates {
//   init: StructureState;
// }

// export type StructureState = {
//   code: StateCode;
//   run: () => void;
//   transition: () => void;
// };

export interface BaseRoomState {
  init: RoomState;
}

export type RoomState = {
  code: StateCode;
  run: () => void;
  transition: () => void;
};
