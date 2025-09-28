const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
const DATA_FILE = 'data.json';
const VISIT_FILE = 'visits.json';

// Khởi tạo file visits nếu chưa có
if(!fs.existsSync(VISIT_FILE)) fs.writeFileSync(VISIT_FILE, JSON.stringify({count:0}));
// API đếm số lượt truy cập
app.get('/api/visits', (req, res) => {
  let visits = { count: 0 };
  try {
    visits = JSON.parse(fs.readFileSync(VISIT_FILE));
  } catch {}
  visits.count++;
  fs.writeFileSync(VISIT_FILE, JSON.stringify(visits));
  res.json({ count: visits.count });
});

// Khởi tạo file nếu chưa có
if(!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));

// Nhận dữ liệu quiz
app.post('/api/submit', (req,res)=>{
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.push(req.body); // thêm dữ liệu mới
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json({status:'ok'});
});

// Trả dữ liệu thống kê
app.get('/api/stats', (req,res)=>{
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const distribution = {Low:0, Moderate:0, High:0};
  data.forEach(item=>{
    if(item.level) distribution[item.level]++;
  });
  res.json({total:data.length, distribution});
});

app.listen(3000, ()=>console.log('Server chạy tại http://localhost:3000'));
  // API trả về số lượt người tham gia khảo sát
  app.get('/api/participants', (req, res) => {
    let data = [];
    try {
      data = JSON.parse(fs.readFileSync(DATA_FILE));
    } catch {}
    res.json({ count: data.length });
  });
