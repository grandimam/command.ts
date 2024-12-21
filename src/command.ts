export interface Command {
  name: string;
  help: string;
  handle: (args: string[]) => Promise<void> | void;
}
