const finalNull = null;
const finalUndefined = undefined;

export const nestedObj = {
  'level1': {
    'level2': {
      'level3': {
        finalNull,
        finalUndefined,
        finalBool: true,
        finalStr: 'myString',
        finalNum: 33322,
        emptyArr: [],
        primitiveArr: ['cat', 'bird', 'dog'],
        objsArr: [
          {
            animal: 'pig',
            sound: 'oink',
          },

          {
            animal: 'cow',
            sound: 'moo',

          },
          {
            animal: 'duck',
            sound: 'quack',
          },

        ],
      },
    },
  },
};

export const nestedObjExtended = {
  'level1': {
    'level2': {
      'level3a': {
        level3Arr: [
          {
            level3Obj: {
              level4Arr: ["one", "two", "three"]
            },

          }],
      },
      level2Str: 'level 2 string',
      'level3': {
        finalNull,
        finalUndefined,
        finalBool: true,
        finalStr: 'myString',
        finalNum: 33322,
        emptyArr: [],
        primitiveArr: ['cat', 'bird', 'dog'],
        objsArr: [
          {
            animal: 'pig',
            sound: 'oink',
          },

          {
            animal: 'cow',
            sound: 'moo',

          },

        ],
      },
      level2Num: 2,
    },
  },
};
