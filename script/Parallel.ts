type fStep = (done: Function) => void;
type fOnDone = (done: string[]) => void;

class Parallel {
  limit: number;
  result: string[] = [];
  tasks: Promise<void>[] = []

  constructor({ parallelJobs }) {
    this.limit = parallelJobs;
  }

  job(task: fStep) {
    const item = this.createTask(task);
    this.tasks.push(item);
    return this;
  }

  async done(onDone: fOnDone) {
    const chunks = this.createChunks(this.tasks);

    await Promise.all(chunks.map(async promise => {
      const value: string[] = await Promise.all(promise);
      this.result.push(...value);
    }));

    onDone(this.result);
  }

  private createTask(func: fStep): Promise<void> {
    return new Promise((res, _) => func(res));
  }

  private createChunks(items, limit = this.limit) {
    const chunks = [];
    let iteration = 0;

    while (iteration < items.length) {
      chunks.push(items.slice(iteration, iteration += limit));
    }

    return chunks;
  }
}

export { Parallel }  