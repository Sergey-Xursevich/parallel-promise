type fStep = (done: Function) => void;
type fOnDone = (done: string[]) => void;

class Parallel {
  limit: number;
  tasks: fStep[] = [];
  results: string[] = [];

  constructor({ parallelJobs }) {
    this.limit = parallelJobs;
  }

  job(task: fStep) {
    this.tasks.push(task);
    return this;
  }

  async done(onDone: fOnDone) {
    await this.runWorker();
    onDone(this.results);
  }

  private runWorker(): Promise<boolean> {
    return new Promise(async (resolve, _) => {
      const currentWorkers = this.tasks.splice(0, this.limit);
      const workersToRun: Promise<string>[] = currentWorkers.map(work => new Promise(res => work(res)));
      const answer = await Promise.all(workersToRun);
      this.results.push(...answer);

      if (this.tasks.length)
        await this.runWorker();

      resolve(true);
    });
  }
}

export { Parallel }  