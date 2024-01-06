import {birdsList} from "@/conf/birds";

export function findBird(value) {
  return birdsList.find((bird) => {
    return bird.value === value
  })
}

export const sortBirds = {
  id: (a, b) => {
    return findBird(a).text > findBird(b).text
  },
  count: (a, b) => {
    return a > b
  }
}
