use std::net::IpAddr;

#[tauri::command]
pub fn ping_ip(ip: String, timeout: u32) -> Result<u32, String> {
    let addr: IpAddr = ip
        .parse()
        .map_err(|e: std::net::AddrParseError| e.to_string())?;
    let timeout = std::time::Duration::from_millis(timeout as u64);

    let start = std::time::Instant::now();
    match ping::dgramsock::ping(addr, Some(timeout), None, None, None, None) {
        Ok(()) => Ok(start.elapsed().as_millis() as u32),
        Err(e) => Err(e.to_string()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ping_ip_test() {
        let result = ping_ip("8.8.8.8".to_string(), 1000);
        println!("{:?}", result);
        assert!(result.is_ok());
    }
}
