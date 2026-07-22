/**
 * Task simulator — simulates task execution for demo/monitoring purposes.
 * Produces realistic completion times, earnings, and progress updates.
 */

export interface TaskResult {
  hours: number;
  earnings: number;
  quality: number; // 0-100
}

/**
 * Simulate completing a Handshake AI task.
 * Returns realistic hours logged and earnings based on task category.
 */
export async function simulateTaskCompletion(_title: string): Promise<TaskResult> {
  const baseHours = 1 + Math.random() * 4; // 1-5 hours
  const hourlyRate = 20 + Math.floor(Math.random() * 25); // $20-45/hr

  // Simulate progress over time
  const steps = 3 + Math.floor(Math.random() * 5);
  for (let i = 1; i <= steps; i++) {
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
    // Progress callback is handled by the caller
  }

  const hours = Math.round(baseHours * 10) / 10;
  const earnings = hours * hourlyRate;
  const quality = 70 + Math.floor(Math.random() * 30); // 70-100

  return { hours, earnings, quality };
}
