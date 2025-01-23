#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![ping::ping_ip, wol::wake])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

pub mod ping;
pub mod wol;
