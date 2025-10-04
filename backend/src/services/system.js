import si from "systeminformation";

export async function getSystemStatus() {
  const [cpuLoad, mem, disk, netStats, os] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.fsSize(),
    si.networkStats(), // <-- network stats
    si.osInfo(),
  ]);

  let netUp = 0;
  let netDown = 0;
  netStats.forEach((iface) => {
    netUp += iface.tx_bytes;
    netDown += iface.rx_bytes;
  });

  return {
    cpu: cpuLoad.currentLoad.toFixed(1),
    ram: ((mem.active / mem.total) * 100).toFixed(1),
    hdd: ((disk[0].used / disk[0].size) * 100).toFixed(1),
    uptime: si.time().uptime,
    network: {
      upload: (netUp / 1024 / 1024).toFixed(2) + " MB", // convert to MB
      download: (netDown / 1024 / 1024).toFixed(2) + " MB",
    },
    os: `${os.distro} ${os.arch} ${os.release}`,
  };
}
