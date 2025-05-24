const allowedOrigins = [
  "https://schoolapp.bluesales.ai",
  "https://schoolwebapp.bluesales.ai",
  "http://192.168.29.210:5173",
  "http://192.168.29.131:5173",
  "http://192.168.29.106:5173",
  "http://192.168.29.210:5174",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:3000",
  "https://h2s9xglk-5173.inc1.devtunnels.ms",
  "https://d9g7pz4q-5173.inc1.devtunnels.ms",
  "https://b9s8zp84-5173.inc1.devtunnels.ms"	
];

export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

