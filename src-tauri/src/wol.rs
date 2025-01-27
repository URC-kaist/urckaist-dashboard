use macaddr::{MacAddr6, ParseError};
use wol::{send_wol, MacAddr};

#[tauri::command]
pub fn wake(mac: String) -> Result<(), String> {
    let mac: MacAddr6 = mac.parse().map_err(|e: ParseError| e.to_string())?;
    send_wol(MacAddr(mac.as_bytes().try_into().unwrap()), None, None).map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;
    const MAC: &str = "e0:51:d8:15:44:5a";

    #[test]
    fn wake_test() {
        let result = wake(MAC.to_string());
        println!("{:?}", result);
        assert!(result.is_ok());
    }
}
