import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "./command";

const commandsDir = join(__dirname, "commands");
const commands: Record<string, Command> = {};

readdirSync(commandsDir).forEach(async (file: string) => {
  if (file.endsWith(".js")) {
    const command: Command = await import(join(commandsDir, file));
    if (command && command.name) {
      commands[command.name] = command;
    }
  }
});

export function runCommand(args: string[]) {
  const [commandName, ...commandArgs] = args;
  if (!commandName) {
    console.log("Available commands:");
    Object.values(commands).forEach((cmd: Command) => {
      console.log(`- ${cmd.name}: ${cmd.help || "No description provided."}`);
    });
    process.exit(0);
  }

  const command = commands[commandName];
  if (!command) {
    console.error(`Command "${commandName}" not found.`);
    process.exit(1);
  }

  command.handle(commandArgs);
}
