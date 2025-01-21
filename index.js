// 存储奖品和参与者数据
let prizes = [];
let participants = [];
let prizeImages = {};

// 从本地存储加载数据
function loadData() {
    const savedPrizes = localStorage.getItem('prizes');
    const savedParticipants = localStorage.getItem('participants');
    const savedPrizeImages = localStorage.getItem('prizeImages');
    
    if (savedPrizes) prizes = JSON.parse(savedPrizes);
    if (savedParticipants) participants = JSON.parse(savedParticipants);
    if (savedPrizeImages) prizeImages = JSON.parse(savedPrizeImages);
    
    updatePrizeList();
    updateParticipantList();
}

// 添加奖品
function addPrize() {
    const prizeInput = document.getElementById('prizeInput');
    const prize = prizeInput.value.trim();
    
    if (prize) {
        prizes.push(prize);
        updatePrizeList();
        prizeInput.value = '';
    }
}

// 更新奖品列表显示
function updatePrizeList() {
    const prizeList = document.getElementById('prizeList');
    prizeList.innerHTML = '';
    
    prizes.forEach((prize, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${prize}
            <button onclick="removePrize(${index})">删除</button>
        `;
        if (prizeImages[prize]) {
            const img = document.createElement('img');
            img.src = prizeImages[prize];
            img.className = 'prize-image';
            li.insertBefore(img, li.firstChild);
        }
        prizeList.appendChild(li);
    });
}

// 删除奖品
function removePrize(index) {
    const prize = prizes[index];
    delete prizeImages[prize];
    prizes.splice(index, 1);
    updatePrizeList();
}

// 添加参与者
function addParticipant() {
    const participantInput = document.getElementById('participantInput');
    const participant = participantInput.value.trim();
    
    if (participant) {
        participants.push(participant);
        updateParticipantList();
        participantInput.value = '';
    }
}

// 更新参与者列表显示
function updateParticipantList() {
    const participantList = document.getElementById('participantList');
    participantList.innerHTML = '';
    
    participants.forEach((participant, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${participant}
            <button onclick="removeParticipant(${index})">删除</button>
        `;
        participantList.appendChild(li);
    });
}

// 删除参与者
function removeParticipant(index) {
    participants.splice(index, 1);
    updateParticipantList();
}

// 处理奖品图片上传
function handlePrizeImage(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const prizeInput = document.getElementById('prizeInput');
            const prize = prizeInput.value.trim();
            if (prize) {
                prizeImages[prize] = e.target.result;
                const previewImage = document.getElementById('previewImage');
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
            } else {
                alert('请先输入奖品名称！');
            }
        };
        reader.readAsDataURL(file);
    }
}

// 处理Excel文件导入
function handleExcelFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, {header: 1});
            
            jsonData.forEach(row => {
                if (row[0] && typeof row[0] === 'string') {
                    const participant = row[0].trim();
                    if (participant && !participants.includes(participant)) {
                        participants.push(participant);
                    }
                }
            });
            
            updateParticipantList();
        };
        reader.readAsArrayBuffer(file);
    }
}

// 导出中奖名单
function exportWinners() {
    const winners = JSON.parse(localStorage.getItem('winners') || '[]');
    if (winners.length === 0) {
        alert('暂无中奖记录！');
        return;
    }
    
    const ws = XLSX.utils.json_to_sheet(winners.map(w => ({
        '获奖者': w.winner,
        '奖品': w.prize,
        '抽奖时间': w.time
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '中奖名单');
    XLSX.writeFile(wb, '中奖名单.xlsx');
}

// 保存配置到本地存储
function saveConfig() {
    localStorage.setItem('prizes', JSON.stringify(prizes));
    localStorage.setItem('participants', JSON.stringify(participants));
    localStorage.setItem('prizeImages', JSON.stringify(prizeImages));
    alert('配置已保存！');
}

// 页面加载时初始化数据
loadData();