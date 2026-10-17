// Shared by weather.html and tides.html (plain script, defines globals).
// High/low tide: local max/min of the hourly series, refined to the minute with a parabola through 3 points.
function extrema(times, v) {
  const out = [];
  for (let i = 1; i < v.length - 1; i++) {
    const [a, b, c] = [v[i - 1], v[i], v[i + 1]];
    if (a == null || b == null || c == null) continue;
    const high = b > a && b >= c, low = b < a && b <= c;
    if (!high && !low) continue;
    const den = a - 2 * b + c, off = den ? 0.5 * (a - c) / den : 0;
    const at = new Date(new Date(times[i] + ":00Z").getTime() + off * 3600e3).toISOString().slice(0, 16);  // tz-free arithmetic on local wall time
    out.push({ i, high, at, h: b - 0.25 * (a - c) * off });
  }
  return out;
}

{ // self-check: 2 days of a 12.42 h tide, peak at 03:00, gives 4 highs, 4 lows, first high at 03:00
  const T = Array.from({ length: 48 }, (_, k) => `2026-01-0${1 + (k / 24 | 0)}T${String(k % 24).padStart(2, "0")}:00`);
  const e = extrema(T, T.map((_, k) => Math.cos(2 * Math.PI * (k - 3) / 12.42)));
  console.assert(e.filter(x => x.high).length === 4 && e.filter(x => !x.high).length === 4 && e[0].at === "2026-01-01T03:00", "tide extrema", e);
}
