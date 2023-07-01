// Run shell process including scripts and commands
function runShellScript(commandLine) {
	// Keep the process running independently from
	// the main process using 'spawn'.
	const { spawn } = require('child_process');
	const runCommandLine = spawn(commandLine, {
		shell: true,
		detached: true,
		stdio: 'ignore'
	});

	// Unlink the child process
	runCommandLine.unref();
}
