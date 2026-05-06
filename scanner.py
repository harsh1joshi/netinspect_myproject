import nmap, requests

VULN_DB = {
    21: ("FTP open – brute force risk", "High"),
    22: ("SSH open – brute force possible", "Medium"),
    23: ("Telnet open – insecure", "High"),
    25: ("SMTP exposed", "Medium"),
    80: ("HTTP service", "Medium"),
    443: ("HTTPS service", "Low"),
    139: ("NetBIOS exposed", "High"),
    445: ("SMB exposed", "High"),
    3306: ("MySQL exposed", "High"),
    3389: ("RDP exposed", "High")
}

def scan_target(target, mode="fast"):
    scanner = nmap.PortScanner()

    if mode == "fast":
        args = "-F -sT -Pn"
    else:
        args = "-p- -sT -sV -Pn"

    scanner.scan(target, arguments=args)

    results = []

    for host in scanner.all_hosts():
        host_data = {
            "host": host,
            "os": "Unknown",
            "ports": []
        }

        if "tcp" in scanner[host]:
            for port in scanner[host]["tcp"]:
                svc = scanner[host]["tcp"][port]["name"]
                ver = scanner[host]["tcp"][port]["version"] or "-"
                vuln, sev = VULN_DB.get(port, ("No known issue", "Info"))

                host_data["ports"].append({
                    "port": port,
                    "service": svc,
                    "version": ver,
                    "vulnerability": vuln,
                    "severity": sev
                })

        results.append(host_data)

    return results

