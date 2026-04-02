function CircularProgress({ value = 0, size = 120, strokeWidth = 10, label = "" }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - value / 100)
  const color = value >= 60 ? "#378ADD" : value >= 30 ? "#EF9F27" : "#E24B4A"
 
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.4s ease" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
        fontSize={size * 0.18} fontWeight="500" fill="currentColor">
        {value}%
      </text>
      {label && (
        <text x="50%" y="65%" textAnchor="middle" fontSize={size * 0.1} fill="#6b7280">
          {label}
        </text>
      )}
    </svg>
  )
}

export default CircularProgress;