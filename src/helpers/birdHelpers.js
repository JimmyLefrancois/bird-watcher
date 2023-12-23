import {birdsList} from "@/conf/birds";

export function findBird(value) {
  return birdsList.find((bird) => {
    return bird.value === value
  })
}
