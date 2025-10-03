import si from "systeminformation";

export async function getSystemStatus() {
  const [cpuLoad, mem, disk] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.fsSize(),
  ]);

  return {
    cpu: cpuLoad.currentLoad.toFixed(1),
    ram: ((mem.active / mem.total) * 100).toFixed(1),
    hdd: ((disk[0].used / disk[0].size) * 100).toFixed(1),
    uptime: si.time().uptime,
  };
}
