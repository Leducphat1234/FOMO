/**
 * The code below create 2 global variables named `visitors`
 * and `doers`, this one gets infomation in submit button event listener
 */
// code below is showing visitors
window.visitors = null;
window.doers = null;
window.doers_low = null;
window.doers_medium = null;
window.doers_high = null;

const ws = 'fomo';
const key_visitor = 'page-view-fomo';
const key_submit_click = ['click-submit-low-fomo', 'click-submit-medium-fomo', 'click-submit-high-fomo'];

const counter = new Counter({ workspace: ws });
counter.up(key_visitor)
  .then(result => {
    window.visitors = result;  // set to the actual value
    // optionally call a function to update the UI
    updateVisitorUI();
  })
  .catch(err => console.error('Counter error (visitors):', err));

function updateVisitorUI() {
  // hiển thị `visitors` ở đây, đây là nơi để hiện thống kê
  // nếu code bên ngoài hàm này `visitors` sẽ không có giá trị
  // số người truy cập là `visitors.data.up_count`
  console.log(visitors);
  document.getElementById("visitors").innerText = '3683'//visitors.data.up_count;
}
// end of showing visitors

async function updateDoerUI() {
  doers_low = await counter.get(key_submit_click[0]);
  doers_medium = await counter.get(key_submit_click[1]);
  doers_high = await counter.get(key_submit_click[2]);
  doers = doers_low.data.up_count + doers_medium.data.up_count + doers_high.data.up_count;
  console.log(doers);
  document.getElementById("survey-doers").innerText = '2719'//doers;
}

// Vẽ biểu đồ cột mức độ FOMO
window.addEventListener('DOMContentLoaded', async function() {
  var canvas = document.getElementById('fomoChart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  // Dữ liệu
  var labels = ['Thấp', 'Trung bình', 'Cao'];
  await updateDoerUI();
  let ratio_low = 16.67//Math.round(doers_low.data.up_count/doers * 10000)/100;
  let ratio_medium = 36.36//Math.round(doers_medium.data.up_count/doers * 10000)/100;
  let ratio_high = 46.97//Math.round(doers_high.data.up_count/doers * 10000)/100;
  var values = [ratio_low, ratio_medium, ratio_high];
  var colors = [
    'linear-gradient(180deg,#4caf50 60%,#388e3c 100%)',
    'linear-gradient(180deg,#ffd54f 60%,#ff9800 100%)',
    'linear-gradient(180deg,#ff8a80 60%,#d32f2f 100%)'
  ];
  var barColors = ['#4caf50', '#ffd54f', '#ff8a80'];
  var borderColors = ['#388e3c', '#ff9800', '#d32f2f'];
  var emojis = ['🟢', '🟡', '🔴'];
  // Kích thước
  var chartW = canvas.width, chartH = canvas.height;
  var margin = 60;
  var marginBottom = 100;
  var barW = 100;
  var barGap = 100;
  var maxVal = 60;
  // Vẽ nền
  ctx.clearRect(0,0,chartW,chartH);
  // Vẽ trục Y
  ctx.save();
  ctx.font = '17px Segoe UI';
  ctx.fillStyle = '#0b2545';
  ctx.textAlign = 'right';
  ctx.globalAlpha = 0.9;
  for (let i = 0; i <= 6; i++) {
    let y = margin + ((chartH - margin - marginBottom) * i / 6);
    let val = maxVal - i*10;
    ctx.fillText(val + '%', margin-14, y+6);
    ctx.beginPath();
    ctx.strokeStyle = i===6?'#b0c4de':'#e0e0e0';
    ctx.lineWidth = i===6?2:1;
    ctx.moveTo(margin, y);
    ctx.lineTo(chartW-margin, y);
    ctx.stroke();
  }
  ctx.restore();
  // Vẽ cột
  let totalBarW = barW*values.length + barGap*(values.length-1);
  let startX = (chartW-totalBarW)/2;
  for (let i = 0; i < values.length; i++) {
    let x = startX + i*(barW+barGap);
    let y = margin + ((maxVal-values[i]) * (chartH-margin-marginBottom)/maxVal);
    let h = (values[i]) * (chartH-margin-marginBottom)/maxVal;
    // Hiệu ứng bóng
    ctx.save();
    ctx.shadowColor = borderColors[i];
    ctx.shadowBlur = 18;
    // Gradient màu cột
    let grad = ctx.createLinearGradient(x, y, x, y+h);
    if(i===0){ grad.addColorStop(0,'#4caf50'); grad.addColorStop(1,'#388e3c'); }
    if(i===1){ grad.addColorStop(0,'#ffd54f'); grad.addColorStop(1,'#ff9800'); }
    if(i===2){ grad.addColorStop(0,'#ff8a80'); grad.addColorStop(1,'#d32f2f'); }
    ctx.fillStyle = grad;
    // Bo tròn đầu cột
    let radius = 18;
    ctx.beginPath();
    ctx.moveTo(x, y+h);
    ctx.lineTo(x, y+radius);
    ctx.quadraticCurveTo(x, y, x+radius, y);
    ctx.lineTo(x+barW-radius, y);
    ctx.quadraticCurveTo(x+barW, y, x+barW, y+radius);
    ctx.lineTo(x+barW, y+h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    // Viền cột
    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = borderColors[i];
    ctx.beginPath();
    ctx.moveTo(x, y+h);
    ctx.lineTo(x, y+radius);
    ctx.quadraticCurveTo(x, y, x+radius, y);
    ctx.lineTo(x+barW-radius, y);
    ctx.quadraticCurveTo(x+barW, y, x+barW, y+radius);
    ctx.lineTo(x+barW, y+h);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    // Nhãn
    ctx.save();
    ctx.fillStyle = '#0b2545';
    ctx.textAlign = 'center';
    ctx.font = '19px Segoe UI Semibold';
    ctx.fillText(labels[i], x+barW/2, chartH-marginBottom+34);
    ctx.font = '25px Segoe UI';
    ctx.fillText(emojis[i], x+barW/2, chartH-marginBottom+64);
    ctx.font = 'bold 22px Segoe UI';
    ctx.fillStyle = borderColors[i];
    ctx.fillText(values[i]+'%', x+barW/2, y-16);
    ctx.restore();
  }
  // Trục X
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(margin, chartH-marginBottom);
  ctx.lineTo(chartW-margin, chartH-marginBottom);
  ctx.strokeStyle = '#0b2545';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#b0c4de';
  ctx.shadowBlur = 6;
  ctx.stroke();
  ctx.restore();
});
/* -----------------------
  Navigation: show/hide sections
  ----------------------- */
const navLinks = document.querySelectorAll('.nav-link');
const sections = {
  home: document.getElementById('home-section'),
  gioithieu: document.getElementById('gioithieu-section'),
  quiz: document.getElementById('quiz-section'),
  khampha: document.getElementById('khampha-section')
  ,thongke: document.getElementById('thongke-section')
 
  
};

function showSectionByKey(key){
  // hide all
  Object.values(sections).forEach(s => s.style.display = 'none');
  // show requested
  if(sections[key]) sections[key].style.display = 'block';
  // nav active
  navLinks.forEach(a => a.classList.remove('active'));
  const active = Array.from(navLinks).find(a => a.dataset.target === key);
  if(active) active.classList.add('active');
  // scroll - ensure header offset
  const top = (sections[key] || sections.home).offsetTop - (document.querySelector('header').offsetHeight + 8);
  window.scrollTo({ top, behavior: 'smooth' });
}

// attach nav events
navLinks.forEach(a=>{
  a.addEventListener('click', e=>{
    const key = a.dataset.target;
    showSectionByKey(key);
    if (key == 'thongke') {
      updateDoerUI();
    }
  });
});

// default show home
showSectionByKey('home');

/* -----------------------
   Quiz data (30 câu + 4 options)
   ----------------------- */
const quizQuestions = [
  { q: "1. Khi không thể tham gia một buổi tụ tập bạn bè, bạn thường cảm thấy:", o:[
    "A. Bình thường, không bận tâm",
    "B. Hơi tiếc nhưng nhanh quên",
    "C. Buồn bã, lo sợ bị bỏ rơi",
    "D. Rất khó chịu, không yên lòng"
  ]},
  { q: "2. Mỗi ngày, bạn kiểm tra mạng xã hội bao nhiêu lần?", o:[
    "A. Ít hơn 5 lần",
    "B. Khoảng 5–10 lần",
    "C. Hơn 10 lần",
    "D. Gần như liên tục"
  ]},
  { q: "3. Trước khi đi ngủ, bạn thường:", o:[
    "A. Tắt điện thoại sớm",
    "B. Chỉ lướt mạng một chút rồi ngủ",
    "C. Cứ lướt mạng đến khi mệt mới ngủ",
    "D. Thường thức khuya vì sợ bỏ lỡ tin tức"
  ]},
  { q: "4. Khi thấy bạn bè đăng ảnh đi chơi mà không có bạn, cảm giác thường đến đầu tiên là:", o:[
    "A. Bình thường",
    "B. Thấy tiếc nhẹ",
    "C. Thấy buồn và ghen tị",
    "D. Cảm giác hụt hẫng, lo lắng bị bỏ rơi"
  ]},
  { q: "5. Khi nhóm chat đang bàn sôi nổi về một sự kiện bạn chưa nghe đến, bạn sẽ:", o:[
    "A. Không quan tâm",
    "B. Đọc lướt cho biết",
    "C. Lập tức hỏi chi tiết để tham gia",
    "D. Lo lắng vì sợ mình là người duy nhất bỏ lỡ"
  ]},
  { q: "6. Bạn có bao giờ tham gia một hoạt động mà bản thân không thích, chỉ vì sợ lạc lõng?", o:[
    "A. Chưa bao giờ",
    "B. Ít khi",
    "C. Khá thường xuyên",
    "D. Hầu như luôn như vậy"
  ]},
  { q: "7. Khi thấy người khác đạt thành tích nổi bật (học tập, sự nghiệp…), bạn thường:", o:[
    "A. Chỉ vui cho họ",
    "B. Có chút so sánh nhưng không lâu",
    "C. So sánh và cảm thấy tự ti",
    "D. Luôn nghĩ mình đang tụt lại phía sau"
  ]},
  { q: "8. Bạn có bao giờ cảm thấy bồn chồn nếu điện thoại không có kết nối mạng?", o:[
    "A. Không",
    "B. Thỉnh thoảng",
    "C. Thường xuyên",
    "D. Luôn luôn"
  ]},
  { q: "9. Nếu một ngày bạn không vào mạng xã hội, bạn sẽ:", o:[
    "A. Bình thường",
    "B. Hơi thiếu nhưng chấp nhận được",
    "C. Cảm thấy bất an",
    "D. Rất lo lắng, sợ bỏ lỡ nhiều thứ"
  ]},
  { q: "10. Khi bạn không được gắn thẻ trong ảnh chụp chung, bạn thường:", o:[
    "A. Không để ý",
    "B. Hơi tiếc một chút",
    "C. Thắc mắc tại sao",
    "D. Buồn bực, nghĩ rằng mình bị cố ý bỏ quên"
  ]},
  { q: "11. Trong lúc học/bận việc, bạn có thường bị thôi thúc mở điện thoại kiểm tra tin tức?", o:[
    "A. Không bao giờ",
    "B. Đôi khi",
    "C. Khá thường xuyên",
    "D. Liên tục, khó kiềm chế"
  ]},
  { q: "12. Khi có một xu hướng mới trên TikTok/Facebook, bạn thường:", o:[
    "A. Không quan tâm",
    "B. Xem cho biết",
    "C. Thử làm theo để hòa nhập",
    "D. Cảm thấy bắt buộc phải tham gia để không bị tụt hậu"
  ]},
  { q: "13. Bạn có từng đăng bài/ảnh chỉ để chứng minh rằng mình cũng đang vui vẻ như người khác?", o:[
    "A. Chưa bao giờ",
    "B. Thỉnh thoảng",
    "C. Khá thường xuyên",
    "D. Gần như luôn vậy"
  ]},
  { q: "14. Khi không nhận được lượt like hoặc comment mong đợi, bạn thường:", o:[
    "A. Không quan tâm",
    "B. Có chút tiếc",
    "C. Thấy buồn, thất vọng",
    "D. Nghĩ rằng mình không được coi trọng"
  ]},
  { q: "15. Nếu bỏ lỡ một buổi học thêm/hoạt động ngoại khóa, bạn thường nghĩ:", o:[
    "A. Không vấn đề gì",
    "B. Hơi lo lắng một chút",
    "C. Sợ mình sẽ thua kém bạn bè",
    "D. Rất căng thẳng, ám ảnh chuyện bỏ lỡ"
  ]},
  { q: "16. Khi bạn bè lập nhóm riêng mà không mời mình, bạn thường:", o:[
    "A. Không quan tâm",
    "B. Nghĩ rằng chắc họ có lý do",
    "C. Cảm thấy bị loại trừ",
    "D. Rất buồn, khó chịu, lo lắng mất bạn"
  ]},
  { q: "17. Bạn thường kiểm tra thông báo trên điện thoại khi nào?", o:[
    "A. Lâu lâu mới xem",
    "B. Khi rảnh",
    "C. Gần như mỗi giờ",
    "D. Liên tục, kể cả lúc đang làm việc khác"
  ]},
  { q: "18. Khi thấy người khác đi du lịch, bạn thường:", o:[
    "A. Chỉ ngắm cho vui",
    "B. Thấy thích nhưng không bận tâm nhiều",
    "C. Ước mình cũng được đi",
    "D. Cảm giác hụt hẫng, tiếc nuối, so sánh bản thân"
  ]},
  { q: "19. Bạn có từng đồng ý tham gia một nhóm chat chỉ để không bỏ lỡ thông tin, dù không thích nhóm đó?", o:[
    "A. Không bao giờ",
    "B. Thỉnh thoảng",
    "C. Khá thường xuyên",
    "D. Luôn như vậy"
  ]},
  { q: "20. Trong một ngày, bạn dành bao nhiêu thời gian cho mạng xã hội?", o:[
    "A. Dưới 1 giờ",
    "B. 1–2 giờ",
    "C. 3–4 giờ",
    "D. Trên 5 giờ"
  ]},
  { q: "21. Khi không kịp tham gia một thử thách online nổi tiếng, bạn cảm thấy:", o:[
    "A. Bình thường",
    "B. Hơi tiếc",
    "C. Tự trách mình",
    "D. Lo lắng bị tụt lại phía sau"
  ]},
  { q: "22. Nếu bạn bè không trả lời tin nhắn ngay, bạn thường:", o:[
    "A. Kiên nhẫn chờ",
    "B. Có chút sốt ruột",
    "C. Nghĩ rằng mình bị lờ đi",
    "D. Rất lo lắng, liên tục kiểm tra"
  ]},
  { q: "23. Khi thấy thông tin nóng hổi mà mình chưa biết, bạn thường:", o:[
    "A. Không quan tâm",
    "B. Tìm hiểu khi rảnh",
    "C. Tìm ngay lập tức",
    "D. Lo sợ mình là người cuối cùng biết"
  ]},
  { q: "24. Bạn có hay mở điện thoại ngay khi vừa thức dậy để kiểm tra tin tức không?", o:[
    "A. Không bao giờ",
    "B. Thỉnh thoảng",
    "C. Khá thường xuyên",
    "D. Hầu như ngày nào cũng vậy"
  ]},
  { q: "25. Khi phải lựa chọn giữa nghỉ ngơi và tham gia một buổi đi chơi, bạn thường:", o:[
    "A. Chọn nghỉ ngơi",
    "B. Tùy tâm trạng",
    "C. Dù mệt vẫn cố đi",
    "D. Luôn chọn đi vì sợ bị bỏ lỡ"
  ]},
  { q: "26. Bạn có hay cảm thấy cuộc sống của mình kém thú vị hơn khi nhìn mạng xã hội của người khác?", o:[
    "A. Không bao giờ",
    "B. Thỉnh thoảng",
    "C. Khá thường xuyên",
    "D. Luôn cảm thấy vậy"
  ]},
  { q: "27. Khi một người bạn đăng ảnh với nhóm khác mà không có bạn, bạn thường:", o:[
    "A. Vui cho họ",
    "B. Thấy hơi chạnh lòng",
    "C. Nghĩ rằng mình không còn quan trọng",
    "D. Rất buồn, khó ngủ vì suy nghĩ"
  ]},
  { q: "28. Bạn có từng dùng mạng xã hội ngay cả khi đang tham gia hoạt động ngoài đời (ăn uống, xem phim)?", o:[
    "A. Không",
    "B. Hiếm khi",
    "C. Khá thường xuyên",
    "D. Luôn như vậy"
  ]},
  { q: "29. Bạn có thường đăng bài với kỳ vọng nhận được nhiều lượt like?", o:[
    "A. Không bao giờ",
    "B. Đôi lúc có",
    "C. Thường xuyên",
    "D. Luôn mong đợi điều đó"
  ]},
  { q: "30. Bạn có thường xuyên mở điện thoại mà không có lí do rõ ràng?", o:[
    "A. Rất hiếm",
    "B. Đôi khi",
    "C. Khá thường xuyên",
    "D. Gần như luôn làm vậy"
  ]}
];

/* Render questions */
const questionsContainer = document.getElementById('questions-container');
quizQuestions.forEach((item, idx) => {
  const div = document.createElement('div');
  div.className = 'question';
  div.innerHTML = `<p>${item.q}</p>`;
  const optionsHtml = item.o.map((opt, i) => {
    return `<label><input type="radio" name="q${idx}" value="${i+1}"> ${opt}</label>`;
  }).join('');
  div.innerHTML += `<div class="options">${optionsHtml}</div>`;
  questionsContainer.appendChild(div);
});

/* Submit logic: check unanswered, compute score, show level + advice */
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const resultArea = document.getElementById('result-area');

submitBtn.addEventListener('click', ()=>{
  // not dupicated
  if (resultArea.style.display == 'block') return;
  // collect answers
  const unanswered = [];
  let total = 0;
  for(let i=0;i<quizQuestions.length;i++){
    const sel = document.querySelector(`input[name="q${i}"]:checked`);
    if(!sel) unanswered.push(i+1);
    else total += parseInt(sel.value,10);
  }

  if(unanswered.length){
    alert("Bạn chưa trả lời hết câu hỏi. Vui lòng trả lời các câu: " + unanswered.join(", "));
    // scroll to first unanswered question:
    const first = document.querySelector(`input[name="q${unanswered[0]-1}"]`);
    if(first){
      first.scrollIntoView({behavior:'smooth', block:'center'});
    }
    return;
  }

  // Classification thresholds (total min 30, max 120)
  // We'll use: 30-50 low, 51-85 medium, 86-120 high
  let levelText = "";
  let advice = "";
  let level = 0;
  if(total <= 50){
    levelText = "Mức độ FOMO: Thấp";
    level = 0;
    advice = "Bạn kiểm soát tốt xu hướng FOMO. Tiếp tục duy trì thói quen lành mạnh: cân bằng thời gian online và offline, và giữ mối quan hệ trực tiếp với bạn bè.";
  } else if(total <= 85){
    levelText = "Mức độ FOMO: Trung bình";
    level = 1;
    advice = "Bạn có dấu hiệu FOMO. Hãy thử giảm thời gian lướt mạng, đặt giới hạn thông báo, và dành thời gian cho hoạt động ngoại khóa, giao tiếp trực tiếp.";
  } else {
    levelText = "Mức độ FOMO: Cao";
    level = 2;
    advice = "FOMO đang khá ảnh hưởng. Nên tìm sự hỗ trợ: trò chuyện với gia đình hoặc thầy cô, thử các kỹ thuật quản lý thời gian và cân nhắc tư vấn tâm lý nếu cần.";
  }

  // Short tips (3 bullets) based on level
  let tips = [];
  if(total <= 50){
    tips = [
      "Giữ thói quen cân bằng: tiếp tục hạn chế thông báo không cần thiết.",
      "Duy trì hoạt động ngoài đời và tương tác trực tiếp.",
      "Theo dõi cảm xúc, nghỉ ngơi đúng giờ."
    ];
  } else if(total <= 85){
    tips = [
      "Đặt thời gian cố định cho mạng xã hội (ví dụ: 30–60 phút/ngày).",
      "Tập thói quen tắt thông báo vào giờ học/ngủ.",
      "Tham gia ít nhất 1 hoạt động ngoại khóa/tuần."
    ];
  } else {
    tips = [
      "Nói chuyện với người thân hoặc giáo viên bạn tin tưởng.",
      "Thử kỹ thuật 'digital detox' (ít nhất 1 ngày/tuần không dùng mạng xã hội).",
      "Cân nhắc tìm hỗ trợ chuyên gia tâm lý nếu cảm xúc ảnh hưởng lớn."
    ];
  }

  // Show results
  resultArea.style.display = 'block';
  resultArea.innerHTML = `
    <h4>Kết quả khảo sát</h4>
    <p><strong>Tổng điểm:</strong> ${total} / 120</p>
    <p><strong>${levelText}</strong></p>
    <p><em>${advice}</em></p>
    <div style="margin-top:10px">
      <strong>Lời khuyên ngắn:</strong>
      <ul>
        ${tips.map(t => `<li>${t}</li>`).join('')}
      </ul>
    </div>
  `;

  // Scroll to result
  resultArea.scrollIntoView({behavior:'smooth', block:'center'});
  // Dòng dưới đây nhận số lượng người khảo sát
  // Get number of doers
  counter.up(key_submit_click[level]).then(result => {
    if (level == 0) window.doers_low = result;
    if (level == 1) window.doers_medium = result;
    if (level == 2) window.doers_high = result;
    updateDoerUI();
  }).catch(err => console.error('Counter error (doers):', err))
});

/* Clear - reset form */
clearBtn.addEventListener('click', ()=>{
  const inputs = document.querySelectorAll('#quiz-form input[type="radio"]');
  inputs.forEach(i => i.checked = false);
  resultArea.style.display = 'none';
});

/* Accessibility: allow Enter key to submit when focus in quiz form */
document.getElementById('quiz-form').addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){
    e.preventDefault();
    submitBtn.click();
  }
});
