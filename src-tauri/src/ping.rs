use std::net::{IpAddr, ToSocketAddrs};

#[tauri::command]
pub fn ping_ip(host: String, timeout: u32) -> Result<u32, String> {
    // Resolve the hostname to an IP address
    let addr = format!("{}:9090", host)
        .to_socket_addrs()
        .map_err(|e| e.to_string())?
        .find(|addr| matches!(addr.ip(), IpAddr::V4(_) | IpAddr::V6(_)))
        .ok_or_else(|| "Failed to resolve hostname to an IP address".to_string())?;

    let timeout = std::time::Duration::from_millis(timeout as u64);

    let start = std::time::Instant::now();
    match ping::dgramsock::ping(addr.ip(), Some(timeout), None, None, None, None) {
        Ok(()) => Ok(start.elapsed().as_millis() as u32),
        Err(e) => Err(e.to_string()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ping_ip_test() {
        let result = ping_ip("google.com".to_string(), 1000); // Use a hostname instead of IP
        println!("{:?}", result);
        assert!(result.is_ok());
    }

    #[test]
    fn ping_ip_test_ip() {
        let result = ping_ip("8.8.8.8".to_string(), 1000); // Still works with IP
        println!("{:?}", result);
        assert!(result.is_ok());
    }
}
