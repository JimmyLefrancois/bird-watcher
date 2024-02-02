import {birdsList} from "@/conf/birds";

export function findBirdInBirdsList(value) {
  return birdsList.find((bird) => {
    return bird.value === value
  })
}

export const sortBirds = {
  id: (a, b) => {
    return findBirdInBirdsList(a).text > findBirdInBirdsList(b).text
  },
  count: (a, b) => {
    return a > b
  }
}
