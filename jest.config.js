export default {
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "ts", "mjs", "cjs"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
};
