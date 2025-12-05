import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GAUSS_POINTS = {
  2: { x: [-0.5773502692, 0.5773502692], w: [1, 1] },
  3: { x: [0, -0.7745966692, 0.7745966692], w: [0.8888888888, 0.5555555555, 0.5555555555] },
};

export default function IntegralCalculator() {
  const [func, setFunc] = useState("x^2 + 2*x + 1");
  const [a, setA] = useState("0");
  const [b, setB] = useState("1");
  const [n, setN] = useState("2");
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState(null);

  const preprocessFunction = (str) => {
    // x^n → x**n
    str = str.replace(/(\w+)\s*\^\s*(\d+)/g, "$1**$2");
    // 2x → 2*x
    str = str.replace(/(\d)([a-zA-Z])/g, "$1*$2");
    return str;
  };

  const calculate = () => {
    try {
      const expr = preprocessFunction(func);
      const f = new Function("x", `return ${expr}`);
      const A = parseFloat(a);
      const B = parseFloat(b);
      const points = GAUSS_POINTS[n];

      const mid = (A + B) / 2;
      const half = (B - A) / 2;

      const integral = points.x.reduce(
        (sum, x, i) => sum + points.w[i] * f(mid + half * x),
        0
      );

      setResult((half * integral).toFixed(8));

      // Grafik uchun data
      const step = (B - A) / 100;
      const labels = [];
      const values = [];
      for (let x = A; x <= B; x += step) {
        labels.push(x.toFixed(2));
        values.push(f(x));
      }

      setChartData({
        labels,
        datasets: [
          {
            label: `f(x) = ${func}`,
            data: values,
            borderColor: "#007bff",
            backgroundColor: "rgba(0, 123, 255, 0.2)",
            tension: 0.3,
          },
        ],
      });
    } catch (error) {
      setResult("❌ Xatolik: ifodani tekshiring!");
      setChartData(null);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      minHeight: "100vh",
      backgroundColor: "#f0f2f5",
      padding: "20px",
      boxSizing: "border-box"
    }}>
      <div style={{
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        width: "100%",
        maxWidth: "500px",
        boxSizing: "border-box"
      }}>
        <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
          Gauss–Legendre Integral Kalkulyatori
        </h1>

        <label style={{ fontWeight: "bold" }}>f(x):</label>
        <input
          type="text"
          value={func}
          onChange={(e) => setFunc(e.target.value)}
          style={{ width: "100%", padding: "10px", margin: "8px 0 16px 0", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px", boxSizing: "border-box" }}
          placeholder="Misol: x^2 + 2*x + 1 yoki (x+1)^3"
        />

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
          <div style={{ flex: "1 1 45%" }}>
            <label style={{ fontWeight: "bold" }}>a:</label>
            <input type="number" value={a} onChange={(e) => setA(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px", boxSizing: "border-box" }} />
          </div>
          <div style={{ flex: "1 1 45%" }}>
            <label style={{ fontWeight: "bold" }}>b:</label>
            <input type="number" value={b} onChange={(e) => setB(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px", boxSizing: "border-box" }} />
          </div>
        </div>

        <label style={{ fontWeight: "bold" }}>Nuqtalar soni (n):</label>
        <select value={n} onChange={(e) => setN(e.target.value)} style={{ width: "100%", padding: "10px", margin: "8px 0 20px 0", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px", boxSizing: "border-box" }}>
          <option value="2">2 nuqtali Gauss</option>
          <option value="3">3 nuqtali Gauss</option>
        </select>

        <button onClick={calculate} style={{ width: "100%", backgroundColor: "#007bff", color: "#fff", fontWeight: "bold", padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}>
          Hisoblash
        </button>

        {result !== null && (
          <div style={{ marginTop: "20px", padding: "14px", backgroundColor: "#e9f5ff", textAlign: "center", borderRadius: "8px", fontWeight: "bold", color: "#007bff", fontSize: "18px" }}>
            Natija: {result}
          </div>
        )}

        {chartData && (
          <div style={{ marginTop: "30px" }}>
            <Line data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
}
