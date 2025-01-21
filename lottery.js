// 存储奖品和参与者数据
let prizes = [];
let participants = [];
let prizeImages = {};
let currentPrize = '';

// 从本地存储加载数据
function loadData() {
    const savedPrizes = localStorage.getItem('prizes');
    const savedParticipants = localStorage.getItem('participants');
    const savedPrizeImages = localStorage.getItem('prizeImages');
    
    if (savedPrizes) prizes = JSON.parse(savedPrizes);
    if (savedParticipants) participants = JSON.parse(savedParticipants);
    if (savedPrizeImages) prizeImages = JSON.parse(savedPrizeImages);
    
    updatePrizeSelector();
    updateParticipantList();
    updateStartButton();
}

// 更新奖品选择器
function updatePrizeSelector() {
    const prizeSelect = document.getElementById('prizeSelect');
    prizeSelect.innerHTML = '<option value="">请选择奖品</option>';
    
    prizes.forEach(prize => {
        const option = document.createElement('option');
        option.value = prize;
        option.textContent = prize;
        prizeSelect.appendChild(option);
    });
    
    if (prizes.length > 0 && !currentPrize) {
        currentPrize = prizes[0];
        prizeSelect.value = currentPrize;
    }
    
    updateCurrentPrize();
}

// 更新当前奖品显示
function updateCurrentPrize() {
    const prizeSelect = document.getElementById('prizeSelect');
    const prizeImage = document.getElementById('currentPrizeImage');
    currentPrize = prizeSelect.value;
    
    if (currentPrize && prizeImages[currentPrize]) {
        prizeImage.src = prizeImages[currentPrize];
        prizeImage.style.display = 'block';
    } else {
        prizeImage.style.display = 'none';
    }
}

// 更新参与者列表显示
function updateParticipantList() {
    const participantList = document.getElementById('currentParticipants');
    participantList.innerHTML = '';
    
    participants.forEach(participant => {
        const li = document.createElement('li');
        li.textContent = participant;
        participantList.appendChild(li);
    });
}

// 更新开始按钮状态
function updateStartButton() {
    const startBtn = document.getElementById('startBtn');
    startBtn.disabled = prizes.length === 0 || participants.length === 0;
}

// 随机抽取获奖者
function getRandomWinner() {
    const randomIndex = Math.floor(Math.random() * participants.length);
    return participants[randomIndex];
}

// 开始抽奖
function startLottery() {
    if (!currentPrize || participants.length === 0) return;
    
    const startBtn = document.getElementById('startBtn');
    const result = document.getElementById('result');
    startBtn.disabled = true;
    
    // 抽奖动画效果
    let times = 0;
    const maxTimes = 20;
    const interval = setInterval(() => {
        times++;
        result.textContent = participants[Math.floor(Math.random() * participants.length)];
        result.classList.add('active');
        
        // 动画结束，显示最终结果
        if (times >= maxTimes) {
            clearInterval(interval);
            const winner = getRandomWinner();
            result.textContent = `恭喜 ${winner} 获得 ${currentPrize}！`;
            
            // 记录中奖信息
            const winners = JSON.parse(localStorage.getItem('winners') || '[]');
            winners.push({
                winner: winner,
                prize: currentPrize,
                time: new Date().toLocaleString()
            });
            localStorage.setItem('winners', JSON.stringify(winners));
            
            // 移除已抽取的奖品
            const prizeIndex = prizes.indexOf(currentPrize);
            if (prizeIndex > -1) {
                prizes.splice(prizeIndex, 1);
                localStorage.setItem('prizes', JSON.stringify(prizes));
            }
            
            // 移除获奖者
            const winnerIndex = participants.indexOf(winner);
            if (winnerIndex > -1) {
                participants.splice(winnerIndex, 1);
                localStorage.setItem('participants', JSON.stringify(participants));
            }
            
            updatePrizeSelector();
            updateParticipantList();
            updateStartButton();
            startBtn.disabled = false;
        }
    }, 100);
}

// 页面加载时初始化数据


loadData();