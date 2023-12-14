use std::process::Stdio;
use tokio::process::Command as AsyncCommand;
use tokio::io::AsyncReadExt;
use std::fs;

#[tauri::command]
pub async fn check_username() -> Result<String, String> {
    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    let script_path = current_dir.join("scripts/check/check_username.sh");

    // Check if the script file exists
    if !script_path.exists() {
        return Err(format!("check username script not found at path: {:?}", script_path));
    }

    // Run the bash script for autoupdate
    let mut child = AsyncCommand::new("bash")
        .arg("-c")
        .arg(fs::read_to_string(&script_path).map_err(|e| format!("Error reading script file: {}", e))?)
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    // Await the child process completion
    let status = child.wait().await.map_err(|e| format!("Error waiting for process: {}", e))?;

    // Check if the command executed successfully
    if status.success() {
        Ok(true.to_string())
    } else {
        let mut error_output = String::new();
        if let Some(mut stderr) = child.stderr.take() {
            stderr.read_to_string(&mut error_output).await.map_err(|e| format!("Error reading stderr: {}", e))?;
        }
        Err(format!("Error executing check username  script: {}", error_output))
    }
}
