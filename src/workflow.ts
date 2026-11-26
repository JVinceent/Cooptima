// The nine stages one harvest lot moves through, shared by the manager, farmer, trucker and buyer screens.
// The order is the order of work. A stage is "done" once the lot has moved past it.
export const STAGES = [
  { id: 'loan', title: 'Loan and plan' },
  { id: 'forecast', title: 'Forecast and alert' },
  { id: 'post', title: 'Post to buyers' },
  { id: 'offer', title: 'Offer and deposit' },
  { id: 'trucks', title: 'Pool trucks' },
  { id: 'pickup', title: 'Pickup' },
  { id: 'dropoff', title: 'Drop-off' },
  { id: 'settle', title: 'Settle' },
  { id: 'receipts', title: 'Receipts' },
] as const

export type StageId = (typeof STAGES)[number]['id']

/** Position of a stage in the workflow (0 to 8). */
export const stageIndex = (id: StageId) => STAGES.findIndex((s) => s.id === id)

/** 'done' before the current stage, 'current' at it, 'later' after it. */
export function stateOf(id: StageId, current: StageId): 'done' | 'current' | 'later' {
  const i = stageIndex(id)
  const c = stageIndex(current)
  return i < c ? 'done' : i === c ? 'current' : 'later'
}

/** The stage that needs the manager's OK next, if any. The manager screens use this to decide what waits. */
export const WAITING_ON_MANAGER: StageId[] = ['trucks', 'offer']
